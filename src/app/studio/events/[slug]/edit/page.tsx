import Link from "next/link";
import { notFound } from "next/navigation";
import { EventEditorForm } from "../../EventEditorForm";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { getEventBySlugAdmin } from "@/lib/cms/events-repo";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { slug } = await params;
  if (!isCmsConfigured()) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-400">
        Configure Supabase first.
      </div>
    );
  }
  const event = await getEventBySlugAdmin(decodeURIComponent(slug));
  if (!event) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/studio/events" className="text-sm text-amber-400 hover:underline">
          ← Events
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-white">Edit event</h1>
      </div>
      <EventEditorForm initial={event} mode="edit" />
    </div>
  );
}
