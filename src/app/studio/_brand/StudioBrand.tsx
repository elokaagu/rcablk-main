import * as React from "react";

/**
 * Studio brand primitives, modelled on the public site's editorial language:
 * - Jubilat serif for body / labels / table cells
 * - RCABLK display for eyebrows and section markers (set via `font-display`)
 * - Hairline borders (`border-black/10`) and tracked-out uppercase eyebrows
 * - `homeHero` orange used sparingly as a brand accent
 *
 * These small primitives keep the studio visually consistent with the public
 * site without recreating the public marketing components, which are heavier
 * and animation-driven.
 */

/* ------------------------------------------------------------------ */
/* Eyebrow                                                             */
/* ------------------------------------------------------------------ */

export function StudioEyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span aria-hidden className="h-px w-6 bg-black/30" />
      <span className="font-display text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/70">
        {children}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */

export function StudioPageHeader({
  eyebrow,
  title,
  description,
  actions,
  back,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex max-w-2xl flex-col gap-3">
        {back && (
          <a
            href={back.href}
            className="font-display text-[0.7rem] font-black uppercase tracking-[0.22em] text-black/55 transition-colors hover:text-black"
          >
            ← {back.label}
          </a>
        )}
        {eyebrow && <StudioEyebrow>{eyebrow}</StudioEyebrow>}
        <h1 className="font-serif text-[2rem] font-normal leading-[1.05] tracking-[-0.015em] sm:text-[2.75rem]">
          {title}
        </h1>
        {description && (
          <p className="font-serif text-[0.95rem] leading-relaxed text-black/65 sm:text-[1.05rem]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function StudioCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={`rounded-md border border-black/10 bg-white p-6 shadow-[0_1px_24px_-18px_rgba(0,0,0,0.18)] ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white hover:bg-homeHero hover:text-black focus-visible:bg-homeHero focus-visible:text-black",
  secondary:
    "bg-homeHero text-black hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white",
  ghost:
    "bg-transparent text-black hover:bg-black/[0.04] focus-visible:bg-black/[0.04] border border-black/15",
  destructive:
    "bg-transparent text-red-700 border border-red-700/30 hover:bg-red-50 focus-visible:bg-red-50",
};

type StudioButtonProps =
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      as?: "button";
      variant?: ButtonVariant;
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as: "a";
      variant?: ButtonVariant;
    });

export function StudioButton(props: StudioButtonProps) {
  const { variant = "primary", className = "" } = props as { variant?: ButtonVariant; className?: string };
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-display text-[0.7rem] font-black uppercase tracking-[0.22em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  if ((props as { as?: string }).as === "a") {
    const { as: _as, variant: _v, className: _c, ...rest } = props as React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as: "a";
      variant?: ButtonVariant;
    };
    return <a {...rest} className={`${base} ${VARIANT_CLASSES[variant]} ${className}`} />;
  }
  const { as: _as, variant: _v, className: _c, ...rest } = props as React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    variant?: ButtonVariant;
  };
  return <button {...rest} className={`${base} ${VARIANT_CLASSES[variant]} ${className}`} />;
}

/* ------------------------------------------------------------------ */
/* Form field shells                                                   */
/* ------------------------------------------------------------------ */

const INPUT_BASE =
  "w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 font-serif text-[0.95rem] text-black placeholder:text-black/40 transition-colors focus:border-black focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

export function StudioFieldLabel({
  children,
  htmlFor,
  hint,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block ${className}`}>
      <span className="font-display text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/60">
        {children}
      </span>
      {hint && (
        <span className="mt-1 block font-serif text-[0.85rem] leading-relaxed text-black/55">{hint}</span>
      )}
    </label>
  );
}

export const StudioInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function StudioInput({ className = "", ...rest }, ref) {
    return <input ref={ref} {...rest} className={`${INPUT_BASE} mt-2 ${className}`} />;
  }
);

export const StudioTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function StudioTextarea({ className = "", ...rest }, ref) {
  return <textarea ref={ref} {...rest} className={`${INPUT_BASE} mt-2 leading-relaxed ${className}`} />;
});

export function StudioField({
  label,
  hint,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <StudioFieldLabel htmlFor={htmlFor} hint={hint}>
        {label}
      </StudioFieldLabel>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notice / callout                                                    */
/* ------------------------------------------------------------------ */

type NoticeTone = "info" | "warn" | "error";

const NOTICE_TONES: Record<NoticeTone, { wrap: string; eyebrow: string }> = {
  info: { wrap: "border-black/10 bg-white", eyebrow: "text-black/60" },
  warn: { wrap: "border-amber-500/40 bg-amber-50/80", eyebrow: "text-amber-900" },
  error: { wrap: "border-red-500/30 bg-red-50/70", eyebrow: "text-red-700" },
};

export function StudioNotice({
  tone = "info",
  title,
  children,
  actions,
}: {
  tone?: NoticeTone;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const t = NOTICE_TONES[tone];
  return (
    <div className={`rounded-md border ${t.wrap} px-5 py-4 sm:px-6 sm:py-5`}>
      {title && (
        <p
          className={`font-display text-[0.7rem] font-black uppercase tracking-[0.22em] ${t.eyebrow}`}
        >
          {title}
        </p>
      )}
      <div className={`${title ? "mt-2" : ""} font-serif text-[0.95rem] leading-relaxed text-black/75`}>
        {children}
      </div>
      {actions && <div className="mt-4 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function StudioInlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.82rem] text-black">
      {children}
    </code>
  );
}

/* ------------------------------------------------------------------ */
/* Wordmark — small "RCA BLK Studio" lockup using the brand display    */
/* font with a thin hairline + subtle homeHero dot.                    */
/* ------------------------------------------------------------------ */

export function StudioWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-[1.1rem] font-black uppercase tracking-[0.04em] text-black">
        RCA BLK
      </span>
      <span aria-hidden className="size-1.5 translate-y-[-0.1em] rounded-full bg-homeHero" />
      <span className="font-display text-[0.7rem] font-black uppercase tracking-[0.32em] text-black/55">
        Studio
      </span>
    </span>
  );
}
