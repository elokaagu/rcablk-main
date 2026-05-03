import Link from "next/link";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { SeedButton } from "./SeedButton";

export default function StudioHomePage() {
  const cms = isCmsConfigured();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-white">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Manage events, news, and site pages (for example Support copy). Changes appear on the public site after you
          save when Supabase is connected and tables are populated.
        </p>
      </div>

      {!cms && (
        <div className="rounded-md border border-amber-900/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium text-amber-200">Supabase is not configured</p>
          <p className="mt-1 text-amber-100/90">
            Add <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
            <code className="rounded bg-black/30 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to your environment. Run
            the SQL in <code className="rounded bg-black/30 px-1">supabase/schema.sql</code> and create a public
            Storage bucket named <code className="rounded bg-black/30 px-1">media</code>.
          </p>
        </div>
      )}

      {cms && (
        <div className="rounded-md border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-sm text-neutral-300">
          <p className="font-medium text-white">First-time setup</p>
          <p className="mt-1 text-neutral-400">
            If tables are empty, copy the bundled events, news, and default Support page into Supabase (safe to run
            more than once — upserts by slug).
          </p>
          <div className="mt-3">
            <SeedButton />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/studio/events"
          className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-600"
        >
          <h2 className="text-lg font-medium text-white">Events</h2>
          <p className="mt-2 text-sm text-neutral-400">Create, edit, and remove exhibition and programme entries.</p>
        </Link>
        <Link
          href="/studio/news"
          className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-600"
        >
          <h2 className="text-lg font-medium text-white">News</h2>
          <p className="mt-2 text-sm text-neutral-400">Publish and update announcements and articles.</p>
        </Link>
        <Link
          href="/studio/pages"
          className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-600 sm:col-span-2 lg:col-span-1"
        >
          <h2 className="text-lg font-medium text-white">Site pages</h2>
          <p className="mt-2 text-sm text-neutral-400">Edit Support and other on-site copy stored in Supabase.</p>
        </Link>
      </div>
    </div>
  );
}
