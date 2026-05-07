"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudioButton } from "./_brand/StudioBrand";

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
    <div className="flex flex-col gap-3">
      <StudioButton
        type="button"
        onClick={() => void seed()}
        disabled={status === "loading"}
        variant="secondary"
      >
        {status === "loading" ? "Seeding…" : "Seed from bundled site data"}
      </StudioButton>
      {msg && (
        <p
          className={`font-serif text-[0.9rem] ${
            status === "error" ? "text-red-700" : "text-emerald-700"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
