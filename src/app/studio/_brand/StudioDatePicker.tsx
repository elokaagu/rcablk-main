"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker, type DateRange } from "react-day-picker";
import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { StudioFieldLabel, StudioInput } from "./StudioBrand";

/* ------------------------------------------------------------------ */
/* Display formatters                                                  */
/* ------------------------------------------------------------------ */

/**
 * Format a single date or date range into a display string that matches the
 * editorial copy used across the public site:
 *   single        →  "12 June 2026"
 *   same month    →  "12–14 June 2026"
 *   cross month   →  "30 June – 2 July 2026"
 *   cross year    →  "30 December 2026 – 2 January 2027"
 *
 * En-dash separators throughout, matching the existing dataset.
 */
function formatDisplayDate(from: Date, to?: Date): string {
  if (!to || isSameDay(from, to)) {
    return format(from, "d MMMM yyyy");
  }
  if (isSameYear(from, to) && isSameMonth(from, to)) {
    return `${format(from, "d")}–${format(to, "d MMMM yyyy")}`;
  }
  if (isSameYear(from, to)) {
    return `${format(from, "d MMMM")} – ${format(to, "d MMMM yyyy")}`;
  }
  return `${format(from, "d MMMM yyyy")} – ${format(to, "d MMMM yyyy")}`;
}

/* ------------------------------------------------------------------ */
/* react-day-picker class overrides                                    */
/* ------------------------------------------------------------------ */

/**
 * Map react-day-picker's default class names onto RCA BLK brand tokens:
 * - Display caps eyebrow for the month / weekday headers
 * - Jubilat serif for day numerals
 * - Solid black for selected days; homeHero wash for the range middle
 * - Hairline ring for "today"
 */
const rdpClassNames = {
  months: "flex flex-col",
  month: "space-y-4",
  caption: "flex items-center justify-between px-1 pb-1",
  caption_label:
    "font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black",
  nav: "flex items-center gap-1",
  nav_button:
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-black/55 transition-colors hover:bg-black/[0.04] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40",
  nav_button_previous: "",
  nav_button_next: "",
  table: "w-full border-collapse",
  head_row: "flex",
  head_cell:
    "w-9 pb-2 text-center font-serif text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/45",
  row: "flex w-full mt-1",
  cell: "relative h-9 w-9 p-0 text-center",
  day:
    "inline-flex h-9 w-9 items-center justify-center rounded-md font-serif text-[0.95rem] text-black transition-colors hover:bg-homeHero/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40",
  day_selected:
    "bg-black text-white hover:bg-black hover:text-white focus-visible:bg-black",
  day_today: "ring-1 ring-inset ring-black/30",
  day_outside: "text-black/25 hover:bg-transparent",
  day_disabled: "cursor-not-allowed text-black/20 hover:bg-transparent",
  day_range_start: "rounded-r-none bg-black text-white",
  day_range_end: "rounded-l-none bg-black text-white",
  day_range_middle:
    "rounded-none bg-homeHero/[0.22] text-black hover:bg-homeHero/[0.32]",
  day_hidden: "invisible",
} as const;

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

export function StudioDatePicker({
  label,
  hint,
  value,
  onChange,
  mode = "range",
  placeholder,
  htmlFor,
}: {
  label: string;
  hint?: React.ReactNode;
  value: string;
  onChange: (next: string) => void;
  /** Default picker mode. Events use ranges; news uses single dates. */
  mode?: "single" | "range";
  placeholder?: string;
  htmlFor?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [pickerMode, setPickerMode] = React.useState<"single" | "range">(mode);
  const [single, setSingle] = React.useState<Date | undefined>(undefined);
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);

  const inputId = React.useId();

  function applySingle(d: Date | undefined) {
    setSingle(d);
    if (d) {
      onChange(formatDisplayDate(d));
    }
  }

  function applyRange(r: DateRange | undefined) {
    setRange(r);
    if (r?.from) {
      onChange(formatDisplayDate(r.from, r.to));
    }
  }

  function clear() {
    setSingle(undefined);
    setRange(undefined);
    onChange("");
  }

  const triggerLabel = value ? "Edit dates" : "Pick from calendar";

  return (
    <div>
      <StudioFieldLabel htmlFor={htmlFor ?? inputId} hint={hint}>
        {label}
      </StudioFieldLabel>

      <StudioInput
        id={htmlFor ?? inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "e.g. 12 June 2026"}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-3.5 py-2 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white focus-visible:outline-none"
            >
              <CalendarIcon size={14} strokeWidth={2.25} aria-hidden />
              <span>{triggerLabel}</span>
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={8}
              collisionPadding={12}
              className="z-50 max-h-[min(80vh,32rem)] w-[min(20rem,calc(100vw-1.5rem))] overflow-y-auto rounded-md border border-black/10 bg-white p-3 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.22)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 sm:w-auto sm:p-4"
            >
              {/* Mode toggle */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div
                  role="radiogroup"
                  aria-label="Date picker mode"
                  className="inline-flex items-center rounded-md border border-black/10 p-0.5"
                >
                  {(["single", "range"] as const).map((m) => {
                    const active = pickerMode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setPickerMode(m)}
                        className={`rounded-sm px-2.5 py-1 font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          active ? "bg-black text-white" : "text-black/55 hover:text-black"
                        }`}
                      >
                        {m === "single" ? "Single" : "Range"}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={clear}
                  className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/55 transition-colors hover:text-black"
                >
                  Clear
                </button>
              </div>

              {/* Calendar */}
              {pickerMode === "single" ? (
                <DayPicker
                  mode="single"
                  selected={single}
                  onSelect={applySingle}
                  showOutsideDays
                  weekStartsOn={1}
                  classNames={rdpClassNames}
                  components={{
                    IconLeft: () => <ChevronLeft size={16} strokeWidth={2.25} />,
                    IconRight: () => <ChevronRight size={16} strokeWidth={2.25} />,
                  }}
                />
              ) : (
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={applyRange}
                  showOutsideDays
                  weekStartsOn={1}
                  numberOfMonths={1}
                  classNames={rdpClassNames}
                  components={{
                    IconLeft: () => <ChevronLeft size={16} strokeWidth={2.25} />,
                    IconRight: () => <ChevronRight size={16} strokeWidth={2.25} />,
                  }}
                />
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3">
                <span className="font-serif text-[0.85rem] text-black/55">
                  {value ? value : "Pick a date to fill the field"}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-black px-4 py-1.5 font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-homeHero hover:text-black"
                >
                  Done
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {value && (
          <button
            type="button"
            onClick={clear}
            className="font-serif text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black/55 transition-colors hover:text-black"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
