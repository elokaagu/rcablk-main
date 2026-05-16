import { NextResponse } from "next/server";
import { slugify } from "@/app/studio/_brand/slugify";
import { isValidNewsPayload } from "@/lib/cms/news-payload";
import {
  deleteNewsAdmin,
  getNewsBySlugAdmin,
  renameNewsAdmin,
  upsertNewsAdmin,
} from "@/lib/cms/news-repo";
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
  const article = await getNewsBySlugAdmin(slug);

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(req: Request, ctx: Ctx) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  const originalSlug = await getDecodedSlug(ctx);

  try {
    const body = await req.json();

    if (!isValidNewsPayload(body)) {
      return NextResponse.json(
        { error: "Valid article with slug is required" },
        { status: 400 }
      );
    }

    const nextSlug = slugify(body.article.slug);

    if (!nextSlug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const article = { ...body.article, slug: nextSlug };

    if (nextSlug !== originalSlug) {
      const collision = await getNewsBySlugAdmin(nextSlug);

      if (collision) {
        return NextResponse.json(
          { error: `Slug “${nextSlug}” is already used by another article.` },
          { status: 409 }
        );
      }

      await renameNewsAdmin(originalSlug, article);

      return NextResponse.json({
        ok: true,
        slug: nextSlug,
        article,
      });
    }

    await upsertNewsAdmin(article);

    return NextResponse.json({
      ok: true,
      slug: nextSlug,
      article,
    });
  } catch (error) {
    console.error("Failed to update news article", error);

    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  const slug = await getDecodedSlug(ctx);

  try {
    await deleteNewsAdmin(slug);

    return NextResponse.json({
      ok: true,
      slug,
    });
  } catch (error) {
    console.error("Failed to delete news article", error);

    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
