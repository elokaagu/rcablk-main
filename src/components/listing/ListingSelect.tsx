"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ListingSelectOption = { value: string; label: string };

type ListingSelectProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: ListingSelectOption[];
  ariaLabel: string;
  className?: string;
};

const triggerClass =
  "h-11 min-h-[44px] min-w-0 gap-1.5 rounded-none border-0 border-b border-black/20 bg-transparent px-0 py-1 font-serif text-base font-normal text-black shadow-none ring-0 ring-offset-0 transition-colors hover:border-black/40 focus:ring-0 focus:ring-offset-0 data-[state=open]:border-black sm:h-9 sm:min-h-0 sm:text-sm [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0 [&>svg]:text-black/50";

const contentClass =
  "z-50 rounded-md border border-black/20 bg-white p-1 font-serif text-sm text-black shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]";

const itemClass =
  "cursor-pointer rounded-sm py-2 pl-8 pr-3 font-serif text-sm text-black focus:bg-black/[0.06] focus:text-black data-[highlighted]:bg-black/[0.06] data-[state=checked]:font-medium";

export function ListingSelect({
  id,
  value,
  onValueChange,
  options,
  ariaLabel,
  className,
}: ListingSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} aria-label={ariaLabel} className={cn(triggerClass, className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={contentClass} position="popper" sideOffset={6}>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className={itemClass}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
