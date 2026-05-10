"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Plus } from "lucide-react";
import type { NewsArticle } from "@/data/news";
import {
  DEFAULT_NEWS_CATEGORIES,
  mergeNewsCategoryOptions,
  resolveCategorySelectValue,
} from "@/data/news-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudioButton, StudioInput } from "./StudioBrand";

const TRIGGER_STUDIO =
  "h-auto min-h-[44px] w-full rounded-md border border-black/15 bg-white px-3.5 py-3 font-serif text-base text-black shadow-none transition-colors focus:border-black focus:outline-none focus:ring-0 data-[placeholder]:text-black/40 disabled:opacity-60 sm:min-h-0 sm:py-2.5 sm:text-[0.95rem] [&>span]:line-clamp-1";

const CONTENT_STUDIO =
  "rounded-md border border-black/15 bg-white font-serif text-base text-black shadow-[0_18px_48px_-12px_rgba(0,0,0,0.22)] sm:text-[0.95rem]";

const ITEM_STUDIO =
  "cursor-pointer rounded-sm py-2.5 pl-8 pr-2 font-serif text-base focus:bg-black/[0.06] focus:text-black data-[highlighted]:bg-black/[0.06] data-[highlighted]:text-black sm:text-[0.95rem]";

export function StudioNewsCategoryField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [fromApi, setFromApi] = React.useState<string[]>([]);
  const [sessionExtras, setSessionExtras] = React.useState<string[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [newLabel, setNewLabel] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/studio/news");
        if (!res.ok) return;
        const articles = (await res.json()) as NewsArticle[];
        if (cancelled) return;
        const cats = articles.map((a) => a.category).filter((c) => typeof c === "string");
        setFromApi(cats);
      } catch {
        /* optional enrichment */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const options = React.useMemo(
    () => mergeNewsCategoryOptions(value, DEFAULT_NEWS_CATEGORIES, fromApi, sessionExtras),
    [value, fromApi, sessionExtras],
  );

  const selectValue = resolveCategorySelectValue(value, options);

  function commitAdd() {
    const t = newLabel.trim();
    if (!t) return;
    setSessionExtras((prev) => (prev.some((p) => p.toLowerCase() === t.toLowerCase()) ? prev : [...prev, t]));
    onChange(t);
    setNewLabel("");
    setAddOpen(false);
  }

  return (
    <div className="mt-2 flex gap-2">
      <div className="min-w-0 flex-1">
        <Select
          value={selectValue}
          onValueChange={(v) => {
            onChange(v);
          }}
        >
          <SelectTrigger className={TRIGGER_STUDIO}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className={CONTENT_STUDIO} position="popper" sideOffset={6}>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt} className={ITEM_STUDIO}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Popover.Root open={addOpen} onOpenChange={setAddOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label="Add new category"
            className="inline-flex size-[44px] shrink-0 items-center justify-center rounded-md border border-black/15 bg-white font-serif text-xl font-semibold leading-none text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 sm:size-10 sm:text-lg"
          >
            <Plus className="size-5 stroke-[2.25]" aria-hidden />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={8}
            collisionPadding={12}
            className="z-50 w-[min(18rem,calc(100vw-1.5rem))] rounded-md border border-black/10 bg-white p-4 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.22)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
          >
            <p className="font-serif text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/60">
              New category
            </p>
            <StudioInput
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Fellowship"
              className="!mt-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitAdd();
                }
              }}
            />
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <StudioButton type="button" variant="ghost" className="!min-h-10 !px-4" onClick={() => setAddOpen(false)}>
                Cancel
              </StudioButton>
              <StudioButton type="button" className="!min-h-10 !px-4" onClick={() => commitAdd()} disabled={!newLabel.trim()}>
                Add
              </StudioButton>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
