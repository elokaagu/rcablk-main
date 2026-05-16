import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { Metadata } from "next";

const description =
  "RCA BLK cookie policy. How we use cookies on rcablk.com and how you can manage your preferences.";

export const metadata: Metadata = {
  title: "Cookie Policy | RCA BLK",
  description,
  openGraph: {
    title: "Cookie Policy | RCA BLK",
    description,
  },
};

export const revalidate = 3600;

export default function CookiePolicy() {
  return <LegalPageLayout slug="cookie-policy" />;
}
