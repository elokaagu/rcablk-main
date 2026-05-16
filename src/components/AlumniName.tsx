"use client";

import Link from "next/link";
import { useAlumniPreview } from "@/components/alumni/AlumniPreviewContext";

interface AlumniNameProps {
  name: string;
  snapshot?: string;
  link?: string;
}

export function AlumniName({ name, snapshot, link }: AlumniNameProps) {
  const { openPreview, scheduleCloseFromName } = useAlumniPreview();

  const handleEnter = () => {
    if (!snapshot) return;
    openPreview({ name, snapshot, link });
  };

  const sharedProps = {
    className: "inline-block cursor-default",
    onMouseEnter: handleEnter,
    onMouseLeave: scheduleCloseFromName,
    onTouchStart: () => {
      if (snapshot) openPreview({ name, snapshot, link });
    },
  };

  const label = (
    <span
      className={`text-lg text-foreground transition-colors duration-200 ${
        link
          ? "underline decoration-black/30 underline-offset-2 hover:bg-secondary/40 hover:text-secondary-foreground rounded-sm px-0.5 -mx-0.5"
          : ""
      }`}
    >
      {name}
    </span>
  );

  if (link) {
    return (
      <Link href={link} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {label}
      </Link>
    );
  }
  return <span {...sharedProps}>{label}</span>;
}
