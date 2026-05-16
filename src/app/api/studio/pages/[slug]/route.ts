import { NextResponse } from "next/server";
import { isValidPagePayload } from "@/lib/cms/page-payload";
import { getSitePageAdmin, upsertSitePageAdmin } from "@/lib/cms/pages-repo";
import { guardStudioRoute } from "@/lib/studio/guard-studio-route";

interface Ctx {
  params: Promise<{ slug: string }>;
}

async function getDecodedSlug(ctx: Ctx) {
  const { slug } = await ctx.params;
  return decodeURIComponent(slug);
}

export async function GET(_req: Request, ctx: Ctx) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  const slug = await getDecodedSlug(ctx);
  const page = await getSitePageAdmin(slug);

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(req: Request, ctx: Ctx) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  const slug = await getDecodedSlug(ctx);

  try {
    const body = await req.json();

    if (!isValidPagePayload(body)) {
      return NextResponse.json({ error: "Valid page payload is required" }, { status: 400 });
    }

    if (body.page.slug !== slug) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }

    await upsertSitePageAdmin(body.page);

    return NextResponse.json({
      ok: true,
      page: body.page,
    });
  } catch (error) {
    console.error("Failed to save site page", error);

    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
