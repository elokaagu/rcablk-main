import type { AlumniMember } from "@/data/alumni";
import { alumniSlugFromName } from "@/lib/alumni-slug";
import { getSnapshotOverridesMap } from "@/lib/cms/alumni-repo";

/** Apply CMS snapshot overrides to a list of bundled alumni members. */
export async function resolveAlumniMembers(members: AlumniMember[]): Promise<AlumniMember[]> {
  const overrides = await getSnapshotOverridesMap();
  if (overrides.size === 0) return members;

  return members.map((member) => {
    const slug = alumniSlugFromName(member.name);
    const custom = overrides.get(slug);
    if (custom === undefined) return member;
    return { ...member, snapshot: custom };
  });
}
