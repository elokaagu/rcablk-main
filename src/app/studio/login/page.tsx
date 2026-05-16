"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  StudioButton,
  StudioEyebrow,
  StudioField,
  StudioInput,
} from "../_brand/StudioBrand";

export default function StudioLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/studio");
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative flex min-h-[calc(100vh-3px)] w-full items-center justify-center overflow-hidden bg-white px-5 py-10 sm:py-16"
      style={{
        paddingTop: "max(2.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Brand watermark — a faint BLK lockup that mirrors the homepage marque
          without dominating the form. Hidden on small screens for clarity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex"
      >
        <div className="relative h-[80vmin] w-[80vmin] opacity-[0.05]">
          <Image
            src="/SVG Letterforms/RCA BLK–Letterforms-BLK.svg"
            alt=""
            fill
            sizes="80vmin"
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-start gap-4">
          <StudioEyebrow>RCA BLK · Studio</StudioEyebrow>
          <h1 className="font-serif text-[1.85rem] font-normal leading-[1.05] tracking-[-0.015em] sm:text-[2.5rem] md:text-[3rem]">
            Sign in to the studio
          </h1>
          <p className="font-serif text-[0.95rem] leading-relaxed text-black/65 sm:text-[1rem]">
            Editorial control for events, news and on-site copy. Authorised members only.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 sm:mt-10">
          <StudioField label="Email" htmlFor="email">
            <StudioInput
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </StudioField>

          <StudioField label="Password" htmlFor="pw">
            <StudioInput
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Studio password"
              required
            />
          </StudioField>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-500/30 bg-red-50/70 px-4 py-3 font-serif text-[0.9rem] text-red-700"
            >
              {error}
            </p>
          )}

          <StudioButton type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </StudioButton>
        </form>
      </div>
    </div>
  );
}
