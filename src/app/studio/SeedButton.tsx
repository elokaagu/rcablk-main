"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function seed() {
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/studio/seed", { method: "POST" });
      const data = (await res.json()) as { error?: string; events?: number; news?: number; pages?: number };
      if (!res.ok) {
        setStatus("error");
        setMsg(data.error || "Seed failed");
        return;
      }
      setStatus("done");
      const pages = data.pages ?? 0;
      setMsg(
        `Imported ${data.events ?? 0} events, ${data.news ?? 0} news articles${pages ? `, and ${pages} site page(s)` : ""}.`
      );
      router.refresh();
    } catch {
      setStatus("error");
      setMsg("Network error");
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void seed()}
        disabled={status === "loading"}
        className="rounded bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
      >
        {status === "loading" ? "Seeding…" : "Seed from bundled site data"}
      </button>
      {msg && <p className={status === "error" ? "text-sm text-red-400" : "text-sm text-emerald-400"}>{msg}</p>}
    </div>
  );
}
