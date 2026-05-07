import { EventEditorForm } from "../EventEditorForm";
import type { EventData } from "@/data/events";
import { StudioPageHeader } from "../../_brand/StudioBrand";

const empty: EventData = {
  slug: "",
  name: "",
  description: "",
  venue: "",
  date: "",
  image: "",
  body: "",
};

export default function NewEventPage() {
  return (
    <div className="space-y-10">
      <StudioPageHeader
        eyebrow="Programme"
        title="New event"
        description="Add a new entry to the public events programme."
        back={{ href: "/studio/events", label: "Events" }}
      />
      <EventEditorForm initial={empty} mode="new" />
    </div>
  );
}
