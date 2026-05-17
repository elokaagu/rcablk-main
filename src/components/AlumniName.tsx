"use client";

import Link from "next/link";
import { useAlumniPreview } from "@/components/alumni/AlumniPreviewContext";
import { getAlumniPrimaryLink, hasAlumniPreview } from "@/lib/alumni-links";

export type AlumniNameProps = {
  name: string;
  snapshot?: string;
  link?: string;
  instagram?: string;
};

export function AlumniName({ name, snapshot, link, instagram }: AlumniNameProps) {
  const { openPreviewForMember, scheduleCloseFromName } = useAlumniPreview();
  const href = getAlumniPrimaryLink({ link, instagram });

  const canPreview = hasAlumniPreview({ snapshot, link, instagram });

  const handleEnter = () => {
    if (!canPreview) return;
    openPreviewForMember({ name, snapshot, link: href });
  };

  const sharedProps = {
    className: "inline-block max-w-full cursor-default touch-manipulation py-0.5",
    onMouseEnter: handleEnter,
    onMouseLeave: scheduleCloseFromName,
    onFocus: handleEnter,
    onBlur: scheduleCloseFromName,
    onTouchStart: () => {
      if (canPreview) openPreviewForMember({ name, snapshot, link: href });
    },
  };

  const label = (
    <span
      className={`text-base leading-snug text-foreground transition-colors duration-200 sm:text-lg ${
        href
          ? "underline decoration-black/30 underline-offset-2 hover:bg-secondary/40 hover:text-secondary-foreground rounded-sm px-0.5 -mx-0.5"
          : canPreview
            ? "underline decoration-black/20 underline-offset-2 decoration-dotted"
            : ""
      }`}
    >
      {name}
    </span>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {label}
      </Link>
    );
  }
  return <span {...sharedProps}>{label}</span>;
}
