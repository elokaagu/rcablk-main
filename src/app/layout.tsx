import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
