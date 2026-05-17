/**
 * Microlink screenshot fallback for alumni URLs Playwright could not reach.
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
  const host = new URL(link).hostname.replace(/^www\./, "").replace(/\./g, "-");
  return `${base}--${host}`;
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

async function microlinkScreenshot(pageUrl) {
  const api = new URL("https://api.microlink.io/");
  api.searchParams.set("url", pageUrl);
  api.searchParams.set("screenshot", "true");
  api.searchParams.set("meta", "false");
  api.searchParams.set("embed", "screenshot.url");

  const res = await fetch(api.toString(), { signal: AbortSignal.timeout(90000) });
  if (!res.ok) return null;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    return json?.data?.screenshot?.url ?? null;
  }
  return null;
}

const patches = new Map();

for (const fail of REPORT.failed) {
  try {
    console.log(`Microlink: ${fail.name}…`);
    const shotUrl = await microlinkScreenshot(fail.link);
    if (!shotUrl) {
      console.log(`✗ ${fail.name}: no screenshot`);
      continue;
    }
    const imgRes = await fetch(shotUrl, { signal: AbortSignal.timeout(60000) });
    if (!imgRes.ok) {
      console.log(`✗ ${fail.name}: download failed`);
      continue;
    }
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const fileName = `${fileId(fail.name, fail.link)}.jpg`;
    await fs.writeFile(path.join(OUT_DIR, fileName), buf);
    patches.set(`${fail.name}::${fail.link}`, `/alumni-previews/${fileName}`);
    console.log(`✓ ${fail.name}`);
  } catch (err) {
    console.log(`✗ ${fail.name}: ${err.message}`);
  }
}

if (patches.size) {
  let source = await fs.readFile(ALUMNI_TS, "utf8");
  source = patchAlumniTs(source, patches);
  await fs.writeFile(ALUMNI_TS, source);
  console.log(`\nUpdated ${patches.size} alumni snapshots.`);
}
