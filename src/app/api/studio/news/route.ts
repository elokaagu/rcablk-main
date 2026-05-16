import { NextResponse } from "next/server";
import { isValidNewsPayload } from "@/lib/cms/news-payload";
import { listNewsAdmin, upsertNewsAdmin } from "@/lib/cms/news-repo";
import { guardStudioRoute } from "@/lib/studio/guard-studio-route";

export async function GET() {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  try {
    const articles = await listNewsAdmin();

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to load news articles", error);

    return NextResponse.json({ error: "Failed to load news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  try {
    const body = await req.json();

    if (!isValidNewsPayload(body)) {
      return NextResponse.json(
        { error: "Valid article with slug and title is required" },
        { status: 400 }
      );
    }

    await upsertNewsAdmin(body.article);

    return NextResponse.json({
      ok: true,
      article: body.article,
    });
  } catch (error) {
    console.error("Failed to save news article", error);

    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}
