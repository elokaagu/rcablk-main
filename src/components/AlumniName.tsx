"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AlumniNameProps {
  name: string;
  snapshot?: string;
  link?: string;
}

export function AlumniName({ name, snapshot, link }: AlumniNameProps) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleEnter = (e: React.MouseEvent | React.TouchEvent) => {
    if (!snapshot) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setPosition({
      x: Math.min(rect.left + 16, window.innerWidth - 276),
      y: Math.max(8, rect.top - 146),
    });
    setHovered(true);
  };

  const sharedProps = {
    className: "inline-block cursor-default",
    onMouseEnter: handleEnter,
    onMouseLeave: () => setHovered(false),
    onTouchStart: handleEnter,
    onTouchEnd: () => setTimeout(() => setHovered(false), 300),
  };

  const content = (
    <>
      <span
        className={`text-lg text-foreground ${link ? "underline underline-offset-2 hover:opacity-80" : ""}`}
      >
        {name}
      </span>
      {snapshot && hovered && (
        <span
          className="fixed z-50 pointer-events-none"
          style={{ left: position.x, top: position.y }}
        >
          <span className="block w-64 aspect-[4/3] overflow-hidden bg-white shadow-lg border border-foreground/10">
            <Image
              src={snapshot}
              alt={`${name} – work`}
              width={256}
              height={192}
              className="w-full h-full object-cover"
              sizes="256px"
            />
          </span>
          {link && (
            <span className="block mt-1 text-sm text-foreground/80 truncate max-w-64">
              View work →
            </span>
          )}
        </span>
      )}
    </>
  );

  if (link) {
    return (
      <Link href={link} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {content}
      </Link>
    );
  }
  return <span {...sharedProps}>{content}</span>;
}
