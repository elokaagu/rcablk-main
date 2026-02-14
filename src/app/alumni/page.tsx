import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { AlumniName } from "@/components/AlumniName";
import { foundingMembers, alumni } from "@/data/alumni";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni | RCA BLK",
  description: "RCA BLK founding members and alumni. Artists and practitioners of Black and African heritage.",
  openGraph: { title: "Alumni | RCA BLK" },
};

const NameList = ({ members }: { members: typeof foundingMembers }) => {
  const col1 = members.filter((_, i) => i % 2 === 0);
  const col2 = members.filter((_, i) => i % 2 === 1);
  return (
    <div className="grid grid-cols-2 gap-x-4 sm:gap-x-16 gap-y-1">
      <div className="flex flex-col gap-1">
        {col1.map((m, i) => (
          <AlumniName key={`${m.name}-${i}`} name={m.name} snapshot={m.snapshot} link={m.link} />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {col2.map((m, i) => (
          <AlumniName key={`${m.name}-${i}`} name={m.name} snapshot={m.snapshot} link={m.link} />
        ))}
      </div>
    </div>
  );
};

export default function Alumni() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full min-w-0" style={{ backgroundColor: "hsl(207, 70%, 85%)" }}>
      <SlideOutMenu />

      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
        <Logo className="h-10" />
      </div>

      <div className="text-center py-8">
        <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">Alumni</h2>
      </div>

      <main className="flex-1 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto w-full pb-12 sm:pb-16 space-y-12 sm:space-y-16">
        {/* Founding Members */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          <h3 className="text-xl italic text-foreground font-medium">Founding Members</h3>
          <NameList members={foundingMembers} />
        </div>

        {/* Alumni */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          <h3 className="text-xl italic text-foreground font-medium">Alumni</h3>
          <NameList members={alumni} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
