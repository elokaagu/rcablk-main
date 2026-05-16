import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import type { Metadata } from "next";

const description = "RCA BLK accessibility statement. We aim to meet WCAG 2.2 Level AA.";

export const metadata: Metadata = {
  title: "Accessibility | RCA BLK",
  description,
  openGraph: {
    title: "Accessibility | RCA BLK",
    description,
  },
};

export const revalidate = 3600;

export default function Accessibility() {
  return <LegalPageLayout slug="accessibility" />;
}
