import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";

/** Sticky black header bar on inner pages (Studio Frith feedback). */
export function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black">
      <div
        className="mx-auto flex min-h-12 max-w-[100rem] items-center justify-between px-5 sm:min-h-14 sm:px-8"
        style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
      >
        <Link
          href="/"
          className="font-display text-sm font-black uppercase leading-none tracking-[0.12em] text-white sm:text-base"
          aria-label="RCA BLK home"
        >
          RCA BLK
        </Link>
        <SlideOutMenu embedded iconOnDark />
      </div>
    </header>
  );
}
