import { NextResponse } from "next/server";
import { buildAlumniCatalog } from "@/lib/alumni-catalog";
import { listSnapshotOverridesAdmin } from "@/lib/cms/alumni-repo";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { requireStudioCookie } from "@/lib/studio/auth-route";

export async function GET() {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const catalog = buildAlumniCatalog();
    const overrides = await listSnapshotOverridesAdmin();
    const members = catalog.map((entry) => {
      const override = overrides.get(entry.slug);
      return {
        ...entry,
        effectiveSnapshot: override ?? entry.staticSnapshot ?? "",
        hasOverride: overrides.has(entry.slug),
      };
    });
    return NextResponse.json({ members });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load alumni" }, { status: 500 });
  }
}
