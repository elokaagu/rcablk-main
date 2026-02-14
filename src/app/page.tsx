import RCALetterforms from "@/components/RCALetterforms";
import Footer from "@/components/Footer";
import SlideOutMenu from "@/components/SlideOutMenu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RCA BLK | Royal College of Art Association of Black Students, Alumni & Friends",
  description: "RCA BLK promotes and supports contemporary visual arts for artists of Black and African heritage within the RCA community.",
  openGraph: { title: "RCA BLK" },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full min-w-0">
      {/* Thin dark top bar - menu toggle sits in this strip */}
      <div
        className="fixed top-0 left-0 right-0 z-40 h-12 sm:h-14 shrink-0"
        style={{ backgroundColor: "hsl(220, 15%, 18%)" }}
      />
      <SlideOutMenu iconOnDark />
      <main className="flex-1 flex items-center justify-center pt-12 sm:pt-14 min-h-0">
        <RCALetterforms />
      </main>
      <Footer />
    </div>
  );
}
