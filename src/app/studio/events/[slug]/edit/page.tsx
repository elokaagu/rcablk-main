import { notFound } from "next/navigation";
import { EventEditorForm } from "../../EventEditorForm";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { getEventBySlugAdmin } from "@/lib/cms/events-repo";
import { StudioNotice, StudioPageHeader } from "../../../_brand/StudioBrand";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!isCmsConfigured()) {
    return (
      <div className="space-y-10">
        <StudioPageHeader
          eyebrow="Programme"
          title="Edit event"
          back={{ href: "/studio/events", label: "Events" }}
        />

        <StudioNotice tone="warn" title="Supabase not configured">
          Configure Supabase first.
        </StudioNotice>
      </div>
    );
  }

  const event = await getEventBySlugAdmin(decodedSlug);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Programme"
        title={event.name || "Edit event"}
        description="Edit the public-facing programme entry. Changes take effect on save."
        back={{ href: "/studio/events", label: "Events" }}
      />

      <EventEditorForm initial={event} mode="edit" />
    </div>
  );
}
