"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/studio/login";

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    router.push("/studio/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {!isLogin && (
        <header className="border-b border-neutral-800 bg-neutral-950/95 px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-300">
              <Link href="/studio" className="text-white hover:underline">
                Dashboard
              </Link>
              <Link href="/studio/events" className="hover:underline">
                Events
              </Link>
              <Link href="/studio/news" className="hover:underline">
                News
              </Link>
              <Link href="/studio/pages" className="hover:underline">
                Pages
              </Link>
              <Link href="/" className="text-neutral-500 hover:text-neutral-300">
                View site
              </Link>
            </nav>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-sm text-neutral-400 underline-offset-2 hover:text-white hover:underline"
            >
              Sign out
            </button>
          </div>
        </header>
      )}
      <div className={isLogin ? "" : "mx-auto max-w-6xl px-4 py-8 sm:px-6"}>{children}</div>
    </div>
  );
}
