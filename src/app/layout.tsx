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
        {adobeFontKitId && (
          <link
            rel="stylesheet"
            href={`https://use.typekit.net/${adobeFontKitId}.css`}
          />
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
