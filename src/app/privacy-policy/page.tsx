import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { Metadata } from "next";

const description =
  "RCA BLK privacy policy. How we collect, use, and protect your personal information.";

export const metadata: Metadata = {
  title: "Privacy Policy | RCA BLK",
  description,
  openGraph: {
    title: "Privacy Policy | RCA BLK",
    description,
  },
};

export const revalidate = 3600;

export default function PrivacyPolicy() {
  return <LegalPageLayout slug="privacy-policy" />;
}
