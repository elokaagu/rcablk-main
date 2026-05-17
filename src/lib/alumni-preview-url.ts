/** Client-safe URL checks for alumni portfolio previews. */

function isInstagramUrl(url: string): boolean {
  try {
    const host = new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, "");
    return host === "instagram.com";
  } catch {
    return false;
  }
}

export function isPreviewableLink(link: string): boolean {
  const t = link.trim();
  if (!t || t.startsWith("mailto:") || isInstagramUrl(t)) return false;
  return isAllowedPreviewUrl(t);
}

export function isAllowedPreviewUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;

    const host = u.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
      return false;
    }

    if (
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      host === "0.0.0.0"
    ) {
      return false;
    }

    const bare = host.replace(/^\[|\]$/g, "");
    if (bare === "::1" || bare.startsWith("fc") || bare.startsWith("fd")) return false;

    return true;
  } catch {
    return false;
  }
}
