"use client";

import { Search } from "lucide-react";
import { SORT_LABELS, type SortOption } from "@/lib/listing-filters";
import { ListingSelect } from "@/components/listing/ListingSelect";
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
  className?: string;
};

const sortOptions = (Object.keys(SORT_LABELS) as SortOption[]).map((key) => ({
  value: key,
  label: SORT_LABELS[key],
}));

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
  className,
}: ListingToolbarProps) {
  const hasActiveFilters = query.trim().length > 0 || filterValue !== "all";

  return (
    <div
      className={cn("mb-8 border-b border-black/12 pb-6 sm:mb-10", className)}
      role="search"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-serif text-sm text-black/55" aria-live="polite">
          {resultCount === totalCount ? (
            <span>{totalCount} items</span>
          ) : (
            <span>
              {resultCount} of {totalCount}
              {hasActiveFilters ? " shown" : ""}
            </span>
          )}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              onFilterChange("all");
            }}
            className="font-display text-[0.6rem] font-black uppercase tracking-[0.18em] text-black/55 underline decoration-black/25 underline-offset-[3px] transition-opacity hover:text-black/80"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6 lg:gap-8">
        <div className="min-w-0 flex-1">
          <label htmlFor="listing-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35"
              aria-hidden
            />
            <input
              id="listing-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-full border-0 border-b border-black/20 bg-transparent pl-7 pr-2 font-serif text-sm text-black outline-none transition-colors placeholder:text-black/40 focus-visible:border-black"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 sm:shrink-0">
          <div>
            <p
              id="listing-sort-label"
              className="mb-1 font-display text-[0.55rem] font-black uppercase tracking-[0.2em] text-black/45"
            >
              Sort
            </p>
            <ListingSelect
              id="listing-sort"
              value={sort}
              onValueChange={(v) => onSortChange(v as SortOption)}
              options={sortOptions}
              ariaLabel="Sort order"
              className="min-w-[9.5rem]"
            />
          </div>

          <div>
            <p
              id="listing-filter-label"
              className="mb-1 font-display text-[0.55rem] font-black uppercase tracking-[0.2em] text-black/45"
            >
              {filterLabel}
            </p>
            <ListingSelect
              id="listing-filter"
              value={filterValue}
              onValueChange={onFilterChange}
              options={filterOptions}
              ariaLabel={filterLabel}
              className="min-w-[9.5rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
