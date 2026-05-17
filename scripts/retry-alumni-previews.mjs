/** Retry screenshot capture for failed alumni URLs. */
import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORT = JSON.parse(await fs.readFile(path.join(__dirname, "alumni-preview-report.json"), "utf8"));

const OUT_DIR = path.join(ROOT, "public/alumni-previews");
const VIEWPORT = { width: 1280, height: 900 };

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

async function capture(page, url, outPath) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: outPath,
    type: "jpeg",
    quality: 82,
    clip: {
      x: Math.floor((VIEWPORT.width - 560) / 2),
      y: 80,
      width: 560,
      height: Math.floor((560 * 4) / 3),
    },
  });
}

const alternates = {
  "https://www.elokaagu.com/": ["https://elokaagu.com/"],
  "https://www.addai-davis.com/": ["https://addai-davis.com/"],
};

const launchOptions = { headless: true };
if (process.platform === "darwin") launchOptions.channel = "chrome";

const browser = await chromium.launch(launchOptions);

for (const fail of REPORT.failed) {
  const urls = [fail.link, ...(alternates[fail.link] ?? [])];
  const fileName = `${fileId(fail.name, fail.link)}.jpg`;
  const outPath = path.join(OUT_DIR, fileName);
  let ok = false;

  for (const url of urls) {
    const ctx = await browser.newContext({ viewport: VIEWPORT });
    const page = await ctx.newPage();
    try {
      console.log(`Trying ${fail.name}: ${url}`);
      await capture(page, url, outPath);
      console.log(`✓ ${fail.name}`);
      ok = true;
      await ctx.close();
      break;
    } catch (err) {
      console.log(`✗ ${url}: ${err.message.split("\n")[0]}`);
    }
    await ctx.close();
  }

  if (!ok) console.log(`FAILED ${fail.name}`);
}

await browser.close();
