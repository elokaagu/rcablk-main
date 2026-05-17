/**
 * Capture portfolio screenshots for alumni links.
 * Run: npm run alumni:previews
 *
 * Output: public/alumni-previews/*.jpg + scripts/alumni-preview-report.json
 * Then rewrites snapshot paths in src/data/alumni.ts
 */

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ALUMNI_TS = path.join(ROOT, "src/data/alumni.ts");
const OUT_DIR = path.join(ROOT, "public/alumni-previews");
const REPORT_PATH = path.join(__dirname, "alumni-preview-report.json");

const VIEWPORT = { width: 1280, height: 900 };
const CONCURRENCY = 2;
const NAV_TIMEOUT_MS = 45_000;

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isScreenshotableLink(link) {
  if (!link?.trim()) return false;
  if (link.startsWith("mailto:")) return false;
  try {
    const u = new URL(link);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function parseAlumniTs(source) {
  const members = [];
  const entryRe =
    /\{\s*name:\s*"((?:\\.|[^"\\])*)"(?:,\s*snapshot:\s*"((?:\\.|[^"\\])*)")?(?:,\s*link:\s*"((?:\\.|[^"\\])*)")?/g;

  let m;
  while ((m = entryRe.exec(source))) {
    members.push({
      name: m[1].replace(/\\"/g, '"'),
      snapshot: m[2]?.replace(/\\"/g, '"'),
      link: m[3]?.replace(/\\"/g, '"'),
    });
  }
  return members;
}

function fileId(name, link) {
  const base = slugify(name);
  const host = (() => {
    try {
      return new URL(link).hostname.replace(/^www\./, "").replace(/\./g, "-");
    } catch {
      return "site";
    }
  })();
  return `${base}--${host}`;
}

async function capture(page, url, outPath) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS });
  await page.waitForTimeout(2500);

  const clip = {
    x: Math.floor((VIEWPORT.width - 560) / 2),
    y: 80,
    width: 560,
    height: Math.floor((560 * 4) / 3),
  };

  await page.screenshot({
    path: outPath,
    type: "jpeg",
    quality: 82,
    clip,
  });
}

function rewriteAlumniTs(source, snapshotByKey) {
  return source.replace(
    /\{\s*name:\s*"((?:\\.|[^"\\])*)"(?:,\s*snapshot:\s*"((?:\\.|[^"\\])*)")?(?:,\s*link:\s*"((?:\\.|[^"\\])*)")?/g,
    (full, rawName, _oldSnap, rawLink) => {
      const name = rawName.replace(/\\"/g, '"');
      const link = rawLink?.replace(/\\"/g, '"');
      const key = link ? `${name}::${link}` : name;
      const snapshot = snapshotByKey.get(key);

      const parts = [`{ name: "${name.replace(/"/g, '\\"')}"`];
      if (snapshot) parts.push(`snapshot: "${snapshot}"`);
      if (link) parts.push(`link: "${link.replace(/"/g, '\\"')}"`);
      return `${parts.join(", ")} }`;
    },
  );
}

async function main() {
  const source = await fs.readFile(ALUMNI_TS, "utf8");
  const all = parseAlumniTs(source);

  await fs.mkdir(OUT_DIR, { recursive: true });

  const jobs = [];
  const seen = new Set();

  for (const member of all) {
    if (!isScreenshotableLink(member.link)) continue;
    const key = `${member.name}::${member.link}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const id = fileId(member.name, member.link);
    const fileName = `${id}.jpg`;
    jobs.push({
      name: member.name,
      link: member.link,
      fileName,
      outPath: path.join(OUT_DIR, fileName),
      key,
    });
  }

  console.log(`Capturing ${jobs.length} portfolio URLs…\n`);

  const launchOptions = { headless: true };
  if (process.platform === "darwin") {
    launchOptions.channel = "chrome";
  }

  let browser;
  try {
    browser = await chromium.launch(launchOptions);
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  for (let i = 0; i < jobs.length; i += CONCURRENCY) {
    const batch = jobs.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (job) => {
        const ctx = await browser.newContext({
          viewport: VIEWPORT,
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          locale: "en-GB",
        });
        const page = await ctx.newPage();
        try {
          await capture(page, job.link, job.outPath);
          job.ok = true;
          job.snapshot = `/alumni-previews/${job.fileName}`;
          console.log(`✓ ${job.name}`);
        } catch (err) {
          job.ok = false;
          job.error = err instanceof Error ? err.message : String(err);
          console.log(`✗ ${job.name}: ${job.error}`);
        }
        await ctx.close();
      }),
    );
  }

  await browser.close();

  const snapshotByKey = new Map();
  for (const job of jobs) {
    if (job.ok && job.snapshot) snapshotByKey.set(job.key, job.snapshot);
  }

  const updated = rewriteAlumniTs(source, snapshotByKey);
  await fs.writeFile(ALUMNI_TS, updated);

  const noLink = all.filter((m) => !m.link?.trim());
  const mailtoOnly = all.filter((m) => m.link?.startsWith("mailto:"));
  const failed = jobs.filter((j) => !j.ok);
  const succeeded = jobs.filter((j) => j.ok);

  const report = {
    generatedAt: new Date().toISOString(),
    totalMembers: all.length,
    screenshotAttempts: jobs.length,
    succeeded: succeeded.length,
    failed: failed.map((j) => ({ name: j.name, link: j.link, error: j.error })),
    withoutAnyLink: noLink.map((m) => m.name),
    mailtoOnly: mailtoOnly.map((m) => ({ name: m.name, link: m.link })),
  };

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log("\n--- Summary ---");
  console.log(`Screenshots saved: ${succeeded.length}/${jobs.length}`);
  console.log(`No link (${noLink.length}):`, noLink.map((m) => m.name).join(", "));
  console.log(`Mailto only (${mailtoOnly.length}):`, mailtoOnly.map((m) => m.name).join(", "));
  if (failed.length) {
    console.log(`Failed captures (${failed.length}):`);
    for (const f of failed) console.log(`  - ${f.name}: ${f.error}`);
  }
  console.log(`\nReport: ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
