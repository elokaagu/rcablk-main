import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsEditorForm } from "../../NewsEditorForm";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { getNewsBySlugAdmin } from "@/lib/cms/news-repo";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditNewsPage({ params }: Props) {
  const { slug } = await params;
  if (!isCmsConfigured()) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">
        Configure Supabase first.
      </div>
    );
  }
  const article = await getNewsBySlugAdmin(decodeURIComponent(slug));
  if (!article) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/studio/news" className="text-sm text-amber-400 hover:underline">
          ← News
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-white">Edit article</h1>
      </div>
      <NewsEditorForm initial={article} mode="edit" />
    </div>
  );
}
