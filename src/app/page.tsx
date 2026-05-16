import RCALetterforms from "@/components/RCALetterforms";
import Footer from "@/components/Footer";
import SlideOutMenu from "@/components/SlideOutMenu";
import PageBackground from "@/components/PageBackground";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RCA BLK | Royal College of Art Association of Black Students, Alumni & Friends",
  description:
    "RCA BLK promotes and supports contemporary visual arts for artists of Black and African heritage within the RCA community.",
  openGraph: { title: "RCA BLK" },
};

export default function Home() {
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-homeHero">
      <PageBackground color="hsl(40, 100%, 50%)" />
      <SlideOutMenu />
      <main className="flex min-h-0 w-full flex-1 flex-col pb-0">
        <RCALetterforms />
      </main>
      <Footer />
    </div>
  );
}
