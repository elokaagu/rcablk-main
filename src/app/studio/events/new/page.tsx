import Link from "next/link";
import { EventEditorForm } from "../EventEditorForm";
import type { EventData } from "@/data/events";

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
    <div className="space-y-8">
      <div>
        <Link href="/studio/events" className="text-sm text-amber-400 hover:underline">
          ← Events
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-white">New event</h1>
      </div>
      <EventEditorForm initial={empty} mode="new" />
    </div>
  );
}
