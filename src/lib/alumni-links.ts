import { isPreviewableLink } from "@/lib/alumni-preview-url";

export type AlumniLinkFields = {
  link?: string;
  instagram?: string;
  snapshot?: string;
};

export function isInstagramUrl(url: string): boolean {
  try {
    const host = new URL(url.trim()).hostname.toLowerCase().replace(/^www\./, "");
    return host === "instagram.com";
  } catch {
    return false;
  }
}

/** Portfolio / website / mailto used for navigation and live previews — never Instagram. */
export function getAlumniPrimaryLink(member: AlumniLinkFields): string | undefined {
  const link = member.link?.trim();
  if (!link) return undefined;
  if (isInstagramUrl(link)) return undefined;
  return link;
}

export function hasAlumniPreview(member: AlumniLinkFields): boolean {
  if (member.snapshot) return true;
  const href = getAlumniPrimaryLink(member);
  return Boolean(href && isPreviewableLink(href));
}
