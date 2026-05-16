import type { NewsArticle } from "@/data/news";

export function isValidNewsPayload(body: unknown): body is { article: NewsArticle } {
  if (!body || typeof body !== "object") {
    return false;
  }

  const payload = body as { article?: Partial<NewsArticle> };
  const article = payload.article;

  if (!article) {
    return false;
  }

  const galleryValid =
    article.gallery === undefined ||
    (Array.isArray(article.gallery) && article.gallery.every((item) => typeof item === "string"));

  return Boolean(
    typeof article.slug === "string" &&
      article.slug.trim().length > 0 &&
      typeof article.title === "string" &&
      article.title.trim().length > 0 &&
      typeof article.category === "string" &&
      typeof article.date === "string" &&
      typeof article.image === "string" &&
      Array.isArray(article.body) &&
      article.body.every((paragraph) => typeof paragraph === "string") &&
      galleryValid
  );
}
