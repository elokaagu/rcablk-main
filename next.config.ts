import type { NextConfig } from "next";

function supabaseImageHost(): string | null {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u) return null;
  try {
    return new URL(u).hostname;
  } catch {
    return null;
  }
}

const host = supabaseImageHost();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: host
      ? [{ protocol: "https", hostname: host, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  // Keep server-side HTML processing libs out of the Webpack/Turbopack bundle
  // and let Node resolve them at runtime. This avoids accidental ESM/CJS
  // interop breakage like the html-encoding-sniffer + @exodus/bytes regression
  // that took down /about, /resources, /privacy-policy etc. when sanitization
  // was running through isomorphic-dompurify → jsdom on the server.
  serverExternalPackages: ["sanitize-html"],
};

export default nextConfig;
