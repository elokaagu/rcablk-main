/**
 * For URLs that failed Playwright capture, try og:image download.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ALUMNI_TS = path.join(ROOT, "src/data/alumni.ts");
const OUT_DIR = path.join(ROOT, "public/alumni-previews");
const REPORT = JSON.parse(await fs.readFile(path.join(__dirname, "alumni-preview-report.json"), "utf8"));

function fileId(name, link) {
  const base = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  let host = "site";
  try {
    host = new URL(link).hostname.replace(/^www\./, "").replace(/\./g, "-");
  } catch {
    /* ignore */
  }
  return `${base}--${host}`;
}

async function fetchOgImage(pageUrl) {
  const res = await fetch(pageUrl, {
    headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0 (compatible; RCABLK/1.0)" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return null;
  const html = await res.text();
  const patterns = [
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      try {
        return new URL(m[1], res.url || pageUrl).href;
      } catch {
        /* try next */
      }
    }
  }
  return null;
}

function patchAlumniTs(source, patches) {
  return source.replace(
    /\{\s*name:\s*"((?:\\.|[^"\\])*)"(?:,\s*snapshot:\s*"((?:\\.|[^"\\])*)")?(?:,\s*link:\s*"((?:\\.|[^"\\])*)")?\s*\}/g,
    (full, rawName, _snap, rawLink) => {
      const name = rawName.replace(/\\"/g, '"');
      const link = rawLink?.replace(/\\"/g, '"');
      const key = link ? `${name}::${link}` : name;
      const snapshot = patches.get(key);
      if (!snapshot) return full;
      const parts = [`{ name: "${name.replace(/"/g, '\\"')}"`, `snapshot: "${snapshot}"`];
      if (link) parts.push(`link: "${link.replace(/"/g, '\\"')}"`);
      return `${parts.join(", ")} }`;
    },
  );
}

const patches = new Map();

for (const fail of REPORT.failed) {
  try {
    const og = await fetchOgImage(fail.link);
    if (!og) {
      console.log(`No og:image: ${fail.name}`);
      continue;
    }
    const imgRes = await fetch(og, { signal: AbortSignal.timeout(20000) });
    if (!imgRes.ok) {
      console.log(`Image download failed: ${fail.name}`);
      continue;
    }
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const fileName = `${fileId(fail.name, fail.link)}.jpg`;
    await fs.writeFile(path.join(OUT_DIR, fileName), buf);
    const snapshot = `/alumni-previews/${fileName}`;
    patches.set(`${fail.name}::${fail.link}`, snapshot);
    console.log(`✓ og:image ${fail.name}`);
  } catch (err) {
    console.log(`✗ ${fail.name}: ${err.message}`);
  }
}

if (patches.size) {
  const source = await fs.readFile(ALUMNI_TS, "utf8");
  await fs.writeFile(ALUMNI_TS, patchAlumniTs(source, patches));
  console.log(`\nPatched ${patches.size} entries in alumni.ts`);
}
