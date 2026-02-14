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
      <SlideOutMenu />
      <main className="flex-1 flex items-center justify-center">
        <RCALetterforms />
      </main>
      <Footer />
    </div>
  );
}
