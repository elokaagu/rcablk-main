import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { PageHeader } from "@/components/PageHeader";
import { PageTitle } from "@/components/PageTitle";
import { AlumniName } from "@/components/AlumniName";
import {
  AlumniPreviewAside,
  AlumniPreviewProvider,
} from "@/components/alumni/AlumniPreviewContext";
import { AnimateIn } from "@/components/AnimateIn";
import { AnimateStagger } from "@/components/AnimateStagger";
import { foundingMembers, alumni, type AlumniMember } from "@/data/alumni";
import { brand } from "@/lib/brand-colors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni | RCA BLK",
  description:
    "RCA BLK founding members and alumni. Artists and practitioners of Black and African heritage.",
  openGraph: {
    title: "Alumni | RCA BLK",
    description:
      "RCA BLK founding members and alumni. Artists and practitioners of Black and African heritage.",
  },
};

type NameListProps = {
  members: AlumniMember[];
};

function memberListKey(member: AlumniMember, index: number) {
  return member.link ? `${member.name}::${member.link}` : `${member.name}::${index}`;
}

const NameList = ({ members }: NameListProps) => {
  return (
    <ul className="columns-2 gap-x-6 space-y-1 sm:gap-x-10">
      {members.map((member, index) => (
        <li key={memberListKey(member, index)} className="break-inside-avoid">
          <AlumniName
            name={member.name}
            snapshot={member.snapshot}
            link={member.link}
          />
        </li>
      ))}
    </ul>
  );
};

export default function Alumni() {
  return (
    <div className="flex min-h-screen min-w-0 w-full flex-col overflow-x-hidden bg-brand-blue text-black">
      <PageBackground color={brand.blue} />
      <PageHeader />

      <AnimateIn delay={0.2} duration={0.6} y={20}>
        <header className="px-6 pb-8 pt-10 text-center sm:px-10 sm:py-12">
          <PageTitle>Alumni</PageTitle>
        </header>
      </AnimateIn>

      <AlumniPreviewProvider>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-14 sm:px-10 sm:pb-16 lg:px-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-x-12">
            <AnimateStagger
              delay={0.3}
              stagger={0.08}
              className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-1"
            >
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-8">
                <h2 className="text-xl font-medium italic tracking-brand text-black">
                  Founding Members
                </h2>
                <NameList members={foundingMembers} />
              </section>
            </AnimateStagger>

            <AlumniPreviewAside />

            <AnimateStagger
              delay={0.38}
              stagger={0.08}
              className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-2"
            >
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-8">
                <h2 className="text-xl font-medium italic tracking-brand text-black">Alumni</h2>
                <NameList members={alumni} />
              </section>
            </AnimateStagger>
          </div>
        </main>
      </AlumniPreviewProvider>

      <Footer />
    </div>
  );
}

