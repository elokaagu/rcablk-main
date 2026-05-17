"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { SORT_LABELS, type SortOption } from "@/lib/listing-filters";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

type ListingToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  filterLabel?: string;
  resultCount: number;
  totalCount: number;
  searchPlaceholder?: string;
  /** Tailwind ring-offset class matching page background */
  ringOffsetClass?: string;
  className?: string;
};

const selectClass =
  "h-11 w-full min-w-0 appearance-none rounded-md border-2 border-black bg-white/90 px-3 pr-9 font-serif text-sm text-black shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

const labelClass = "font-display text-[0.65rem] font-black uppercase tracking-[0.2em] text-black/70";

export function ListingToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "Filter",
  resultCount,
  totalCount,
  searchPlaceholder = "Search…",
  ringOffsetClass = "focus-visible:ring-offset-white",
  className,
}: ListingToolbarProps) {
  const hasActiveFilters = query.trim().length > 0 || filterValue !== "all";

  return (
    <div
      className={cn(
        "mb-8 rounded-lg border-2 border-black bg-white/85 p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] sm:mb-10 sm:p-5",
        className,
      )}
      role="search"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className={labelClass}>
          <SlidersHorizontal className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" aria-hidden />
          Refine
        </p>
        <p className="font-serif text-sm text-black/70" aria-live="polite">
          {resultCount === totalCount ? (
            <span>{totalCount} items</span>
          ) : (
            <span>
              {resultCount} of {totalCount}
              {hasActiveFilters ? " shown" : ""}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <label htmlFor="listing-search" className={cn(labelClass, "mb-1.5 block")}>
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
              aria-hidden
            />
            <input
              id="listing-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              className={cn(selectClass, "pl-10", ringOffsetClass)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="listing-sort" className={cn(labelClass, "mb-1.5 block")}>
            Sort
          </label>
          <select
            id="listing-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={cn(selectClass, ringOffsetClass)}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label htmlFor="listing-filter" className={cn(labelClass, "mb-1.5 block")}>
            {filterLabel}
          </label>
          <select
            id="listing-filter"
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className={cn(selectClass, ringOffsetClass)}
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              onFilterChange("all");
            }}
            className="font-serif text-sm text-black underline decoration-black/35 underline-offset-2 hover:opacity-70"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
