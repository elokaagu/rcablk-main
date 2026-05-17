import { foundingMembers, alumni, type AlumniMember } from "@/data/alumni";
import { alumniSlugFromName } from "@/lib/alumni-slug";

export type AlumniSection = "founding" | "alumni";

export type AlumniCatalogEntry = {
  slug: string;
  name: string;
  section: AlumniSection;
  staticSnapshot?: string;
  link?: string;
  instagram?: string;
};

function memberToEntry(member: AlumniMember, section: AlumniSection): AlumniCatalogEntry {
  return {
    slug: alumniSlugFromName(member.name),
    name: member.name,
    section,
    staticSnapshot: member.snapshot,
    link: member.link,
    instagram: member.instagram,
  };
}

/** All alumni rows from bundled data (founding list first, then main alumni). */
export function buildAlumniCatalog(): AlumniCatalogEntry[] {
  return [
    ...foundingMembers.map((m) => memberToEntry(m, "founding")),
    ...alumni.map((m) => memberToEntry(m, "alumni")),
  ];
}

export function getCatalogEntryBySlug(slug: string): AlumniCatalogEntry | null {
  return buildAlumniCatalog().find((e) => e.slug === slug) ?? null;
}
