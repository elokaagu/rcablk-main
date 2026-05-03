"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/studio");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <h1 className="text-center font-serif text-2xl text-white">RCA BLK Studio</h1>
        <p className="mt-2 text-center text-sm text-neutral-400">Admin sign-in</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-neutral-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-offset-neutral-950 focus:ring-2 focus:ring-amber-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="pw" className="mb-1 block text-xs font-medium text-neutral-400">
              Password
            </label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none ring-offset-neutral-950 focus:ring-2 focus:ring-amber-500"
              placeholder="Studio password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-amber-500 py-2 text-sm font-medium text-black hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-xs leading-relaxed text-neutral-500">
          Set <code className="text-neutral-400">STUDIO_EMAIL</code> (optional) and{" "}
          <code className="text-neutral-400">STUDIO_PASSWORD</code>, plus{" "}
          <code className="text-neutral-400">STUDIO_JWT_SECRET</code> in the environment. If{" "}
          <code className="text-neutral-400">STUDIO_EMAIL</code> is omitted, only the password is checked. Connect
          Supabase for live content editing.
        </p>
      </div>
    </div>
  );
}
