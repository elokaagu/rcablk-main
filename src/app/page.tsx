import RCALetterforms from "@/components/RCALetterforms";
import Footer from "@/components/Footer";
import SlideOutMenu from "@/components/SlideOutMenu";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SlideOutMenu />
      <main className="flex-1 flex items-center justify-center">
        <RCALetterforms />
      </main>
      <Footer />
    </div>
  );
}
