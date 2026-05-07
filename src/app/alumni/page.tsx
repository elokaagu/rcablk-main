import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { AlumniName } from "@/components/AlumniName";
import { AlumniPreviewAside, AlumniPreviewProvider } from "@/components/alumni/AlumniPreviewContext";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
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
      <PageBackground color="hsl(207, 70%, 85%)" />
      <SlideOutMenu />

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div className="text-center py-8">
          <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground">Alumni</h2>
        </div>
      </AnimateIn>

      <AlumniPreviewProvider>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-12 sm:px-10 sm:pb-16 lg:px-12">
          {/*
            Mobile: founding → preview strip → alumni (nothing overlays the lists).
            lg+: names in column 1; sticky preview in the right margin (column 2, spans both rows).
          */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-x-14 lg:items-start">
            <AnimateStagger delay={0.3} stagger={0.08} className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-8">
                <h3 className="text-xl font-medium italic text-foreground">Founding Members</h3>
                <NameList members={foundingMembers} />
              </div>
            </AnimateStagger>

            <AlumniPreviewAside />

            <AnimateStagger delay={0.38} stagger={0.08} className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-2">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-8">
                <h3 className="text-xl font-medium italic text-foreground">Alumni</h3>
                <NameList members={alumni} />
              </div>
            </AnimateStagger>
          </div>
        </main>
      </AlumniPreviewProvider>

      <Footer />
    </div>
  );
}
