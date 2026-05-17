import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageLogotype } from "@/components/PageLogotype";
import { BRAND_LOGOTYPES } from "@/data/brand-logotypes";
import { AlumniName } from "@/components/AlumniName";
import {
  AlumniPreviewAside,
  AlumniPreviewProvider,
} from "@/components/alumni/AlumniPreviewContext";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { foundingMembers, alumni, type AlumniMember } from "@/data/alumni";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni | RCA BLK",
  description: "RCA BLK founding members and alumni. Artists and practitioners of Black and African heritage.",
  openGraph: { title: "Alumni | RCA BLK" },
};

type NameListProps = {
  members: AlumniMember[];
};

function memberListKey(member: AlumniMember, index: number) {
  return member.link ? `${member.name}::${member.link}` : `${member.name}::${index}`;
}

const NameList = ({ members }: NameListProps) => (
  <ul className="columns-2 gap-x-4 space-y-1 sm:gap-x-10">
    {members.map((member, index) => (
      <li key={memberListKey(member, index)} className="break-inside-avoid">
        <AlumniName name={member.name} snapshot={member.snapshot} link={member.link} />
      </li>
    ))}
  </ul>
);

export default function Alumni() {
  return (
    <div
      data-page="alumni"
      className="flex min-h-screen min-w-0 w-full flex-col"
      style={{ backgroundColor: "hsl(207, 70%, 85%)" }}
    >
      <PageBackground color="hsl(207, 70%, 85%)" />
      <SlideOutMenu />
      <PageLogotype src={BRAND_LOGOTYPES.blue} />

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <div
          className="px-5 pb-6 pt-12 text-center sm:py-10"
          style={{ paddingTop: "max(3rem, calc(env(safe-area-inset-top) + 2rem))" }}
        >
          <h1 className="font-display text-2xl font-normal text-foreground sm:text-3xl">Alumni</h1>
        </div>
      </AnimateIn>

      <AlumniPreviewProvider>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-12 sm:px-10 sm:pb-16 lg:px-12">
          {/*
            Mobile: founding → alumni → preview (below both lists).
            lg+: lists on the left; preview column stays sticky while scrolling.
          */}
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-x-14">
            <div className="min-w-0 flex-1 space-y-8 overflow-x-clip">
              <AnimateStagger delay={0.3} stagger={0.08} className="min-w-0 space-y-6">
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-8">
                  <h2 className="text-xl font-medium italic text-foreground">Founding Members</h2>
                  <NameList members={foundingMembers} />
                </section>
              </AnimateStagger>

              <AnimateStagger delay={0.38} stagger={0.08} className="min-w-0 space-y-6">
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-8">
                  <h2 className="text-xl font-medium italic text-foreground">Alumni</h2>
                  <NameList members={alumni} />
                </section>
              </AnimateStagger>
            </div>

            <AlumniPreviewAside />
          </div>
        </main>
      </AlumniPreviewProvider>

      <Footer />
    </div>
  );
}
