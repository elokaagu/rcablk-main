/**
 * Fetch a portfolio site's social preview image (og:image / twitter:image).
 * Not a full-page screenshot — most sites expose a representative image in meta tags.
 */

import { isAllowedPreviewUrl, isPreviewableLink } from "@/lib/alumni-preview-url";

export { isAllowedPreviewUrl, isPreviewableLink };

const FETCH_TIMEOUT_MS = 10_000;
const MAX_HTML_BYTES = 512_000;

const USER_AGENT =
  "Mozilla/5.0 (compatible; RCABLK/1.0; +https://rcablk.com) LinkPreviewBot";

function resolveImageUrl(candidate: string, pageUrl: string): string | null {
  const t = candidate.trim();
  if (!t || t.startsWith("data:")) return null;
  try {
    return new URL(t, pageUrl).href;
  } catch {
    return null;
  }
}

function extractMetaImageUrls(html: string, pageUrl: string): string[] {
  const found: string[] = [];
  const push = (raw: string | undefined) => {
    if (!raw) return;
    const resolved = resolveImageUrl(raw, pageUrl);
    if (resolved) found.push(resolved);
  };

  const metaRe =
    /<meta\s+[^>]*(?:property|name)\s*=\s*["']([^"']+)["'][^>]*content\s*=\s*["']([^"']+)["'][^>]*>/gi;
  const metaReAlt =
    /<meta\s+[^>]*content\s*=\s*["']([^"']+)["'][^>]*(?:property|name)\s*=\s*["']([^"']+)["'][^>]*>/gi;

  const keys = new Set([
    "og:image",
    "og:image:secure_url",
    "twitter:image",
    "twitter:image:src",
  ]);

  for (const re of [metaRe, metaReAlt]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const a = m[1]!.toLowerCase();
      const b = m[2]!;
      if (keys.has(a)) push(b);
      if (keys.has(b.toLowerCase())) push(a);
    }
  }

  const linkRe =
    /<link\s+[^>]*rel\s*=\s*["']image_src["'][^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(html))) {
    push(lm[1]);
  }

  return [...new Set(found)];
}

export async function fetchLinkPreviewImage(pageUrl: string): Promise<string | null> {
  if (!isAllowedPreviewUrl(pageUrl)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": USER_AGENT,
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
    });

    if (!res.ok) return null;

    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("text/html") && !type.includes("application/xhtml")) {
      return null;
    }

    const reader = res.body?.getReader();
    if (!reader) return null;

    const decoder = new TextDecoder();
    let html = "";
    let bytes = 0;

    while (bytes < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (/<\/head>/i.test(html)) break;
    }

    reader.cancel().catch(() => {});

    const images = extractMetaImageUrls(html, res.url || pageUrl);
    return images[0] ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
