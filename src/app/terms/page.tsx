import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { Metadata } from "next";

const description = "Terms and conditions of use for the RCA BLK website.";

export const metadata: Metadata = {
  title: "Terms & Conditions | RCA BLK",
  description,
  openGraph: {
    title: "Terms & Conditions | RCA BLK",
    description,
  },
};

export const revalidate = 3600;

export default function Terms() {
  return <LegalPageLayout slug="terms" />;
}
