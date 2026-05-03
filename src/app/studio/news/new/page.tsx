import Link from "next/link";
import type { NewsArticle } from "@/data/news";
import { NewsEditorForm } from "../NewsEditorForm";

const empty: NewsArticle = {
  slug: "",
  title: "",
  category: "Announcement",
  date: "",
  image: "",
  body: [],
};

export default function NewNewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/studio/news" className="text-sm text-amber-400 hover:underline">
          ← News
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-white">New article</h1>
      </div>
      <NewsEditorForm initial={empty} mode="new" />
    </div>
  );
}
