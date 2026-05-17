import { NextResponse } from "next/server";
import { getCatalogEntryBySlug } from "@/lib/alumni-catalog";
import {
  deleteSnapshotOverrideAdmin,
  getSnapshotOverrideAdmin,
  upsertSnapshotOverrideAdmin,
} from "@/lib/cms/alumni-repo";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { requireStudioCookie } from "@/lib/studio/auth-route";

interface Ctx {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { slug } = await ctx.params;
  const decoded = decodeURIComponent(slug);
  const entry = getCatalogEntryBySlug(decoded);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const override = await getSnapshotOverrideAdmin(decoded);
    return NextResponse.json({
      slug: entry.slug,
      name: entry.name,
      section: entry.section,
      staticSnapshot: entry.staticSnapshot ?? "",
      snapshot: override ?? entry.staticSnapshot ?? "",
      hasOverride: override != null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { slug } = await ctx.params;
  const decoded = decodeURIComponent(slug);
  if (!getCatalogEntryBySlug(decoded)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as { snapshot?: string };
    const snapshot = typeof body.snapshot === "string" ? body.snapshot.trim() : "";
    if (!snapshot) {
      return NextResponse.json({ error: "Snapshot URL is required" }, { status: 400 });
    }
    await upsertSnapshotOverrideAdmin(decoded, snapshot);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { slug } = await ctx.params;
  const decoded = decodeURIComponent(slug);
  if (!getCatalogEntryBySlug(decoded)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await deleteSnapshotOverrideAdmin(decoded);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to revert" }, { status: 500 });
  }
}
