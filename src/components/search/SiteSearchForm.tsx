"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteSearchFormProps = {
  className?: string;
  inputId?: string;
  onNavigate?: () => void;
  compact?: boolean;
};

export function SiteSearchForm({
  className,
  inputId = "site-search",
  onNavigate,
  compact = false,
}: SiteSearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    const href = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    router.push(href);
    onNavigate?.();
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)} role="search">
      <label htmlFor={inputId} className="sr-only">
        Search news and events
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
          aria-hidden
        />
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={compact ? "Search…" : "Search news & events"}
          className={cn(
            "w-full rounded-md border-2 border-black bg-white font-serif text-sm text-black outline-none transition-colors placeholder:text-black/45 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
            compact ? "h-10 pl-9 pr-3" : "h-11 pl-10 pr-3",
          )}
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        className="mt-2 w-full rounded-md border-2 border-black bg-black px-3 py-2 font-display text-[0.65rem] font-black uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-85"
      >
        Search
      </button>
    </form>
  );
}
