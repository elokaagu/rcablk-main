"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AlumniSection } from "@/lib/alumni-catalog";

export type StudioAlumniRow = {
  slug: string;
  name: string;
  section: AlumniSection;
  effectiveSnapshot: string;
  hasOverride: boolean;
};

export function StudioAlumniTable({ members }: { members: StudioAlumniRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.slug.includes(q) ||
        (m.section === "founding" ? "founding" : "alumni").includes(q),
    );
  }, [members, query]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Search alumni</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          className="w-full max-w-md rounded-md border border-black/15 bg-white px-4 py-3 font-serif text-[0.95rem] text-black placeholder:text-black/40 focus:border-black/40 focus:outline-none focus:ring-1 focus:ring-black/20"
        />
      </label>

      <p className="font-serif text-[0.85rem] text-black/55">
        {filtered.length} of {members.length} people
        {query.trim() ? ` matching “${query.trim()}”` : ""}
      </p>

      <div className="overflow-x-auto rounded-md border border-black/10 bg-white">
        <table className="w-full min-w-[28rem] text-left">
          <thead className="border-b border-black/10 bg-black/[0.02]">
            <tr className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/55">
              <th className="px-4 py-3 sm:px-5 sm:py-4">Preview</th>
              <th className="px-4 py-3 sm:px-5 sm:py-4">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell sm:px-5 sm:py-4">List</th>
              <th className="px-4 py-3 text-right sm:px-5 sm:py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr
                key={`${m.section}-${m.slug}-${m.name}`}
                className="border-b border-black/5 transition-colors last:border-0 hover:bg-homeHero/[0.06]"
              >
                <td className="px-4 py-3 sm:px-5 sm:py-4">
                  {m.effectiveSnapshot ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={m.effectiveSnapshot}
                      alt=""
                      className="h-14 w-11 rounded object-cover object-center ring-1 ring-black/10"
                    />
                  ) : (
                    <span
                      className="inline-flex h-14 w-11 items-center justify-center rounded bg-black/[0.04] font-serif text-[0.65rem] uppercase tracking-wider text-black/35"
                      aria-hidden
                    >
                      —
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 sm:px-5 sm:py-4">
                  <span className="font-serif text-[0.95rem] text-black sm:text-[0.98rem]">{m.name}</span>
                  {m.hasOverride ? (
                    <span className="mt-1 block font-serif text-[0.75rem] uppercase tracking-[0.14em] text-black/45">
                      Custom image
                    </span>
                  ) : null}
                </td>
                <td className="hidden px-4 py-3 font-serif text-[0.88rem] capitalize text-black/60 sm:table-cell sm:px-5 sm:py-4">
                  {m.section === "founding" ? "Founding" : "Alumni"}
                </td>
                <td className="px-4 py-3 text-right sm:px-5 sm:py-4">
                  <Link
                    href={`/studio/alumni/${encodeURIComponent(m.slug)}/edit`}
                    className="group inline-flex min-h-[44px] items-center gap-2 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:text-black/60"
                  >
                    <span>Edit image</span>
                    <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
