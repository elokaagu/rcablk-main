import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "RCA BLK",
  description: "Royal College of Art Association of Black Students, Alumni & Friends",
  authors: [{ name: "RCA BLK" }],
  openGraph: {
    title: "RCA BLK",
    description: "Royal College of Art Association of Black Students, Alumni & Friends",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rcablk",
  },
};

const adobeFontKitId = process.env.NEXT_PUBLIC_ADOBE_FONT_KIT_ID || "zmg6wro";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/RCABLK-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        {adobeFontKitId && (
          <link
            rel="stylesheet"
            href={`https://use.typekit.net/${adobeFontKitId}.css`}
          />
        )}
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:w-auto focus:h-auto focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:underline focus:outline-2 focus:outline-accent focus:outline-offset-2"
        >
          Skip to main content
        </a>
        <Providers>
          <div id="main-content" tabIndex={-1}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
