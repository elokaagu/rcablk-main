import SlideOutMenu from "@/components/SlideOutMenu";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";

const foundingMembers = [
  "Mary Adeturinmo", "Melanie Issaka",
  "Ibrahim Cissé", "Emily Moore",
  "Michael Forbes", "Roxanne Simone",
  "Sheran Forbes", "Josh Woolford",
  "Andrew Hart", "Timi Oyedeji",
  "Jerome Ince-Mitchell",
];

const alumni = [
  "Amin Abdulrahman", "Thandi Loewenson",
  "Shawn Adams", "Mary Lucas-Afolalu",
  "Joyce Addai-Davis", "Tonderai Maboreke",
  "Temitope Adebowale", "Mary Martins",
  "Toyosi Adenuga", "Nigel Matambo",
  "Ebunoluwa Adepoju", "Althea McNish",
  "Mary Adeturinmo", "Hayden Mills",
  "David Adjaye", "Emily Mitchell",
  "Eloka Agu", "Nicole Moore",
  "Tobi Ajiwe", "Tyler Moorehead",
];

const NameList = ({ names }: { names: string[] }) => {
  const col1 = names.filter((_, i) => i % 2 === 0);
  const col2 = names.filter((_, i) => i % 2 === 1);
  return (
    <div className="grid grid-cols-2 gap-x-16 gap-y-1">
      <div className="flex flex-col gap-1">
        {col1.map((n, i) => <p key={i} className="text-base text-foreground">{n}</p>)}
      </div>
      <div className="flex flex-col gap-1">
        {col2.map((n, i) => <p key={i} className="text-base text-foreground">{n}</p>)}
      </div>
    </div>
  );
};

export default function Alumni() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "hsl(207, 70%, 85%)" }}>
      <SlideOutMenu />

      <div className="px-8 lg:px-12 pt-8">
        <Logo className="h-10" />
      </div>

      <div className="text-center py-8">
        <h2 className="text-3xl font-normal text-foreground">Alumni</h2>
      </div>

      <main className="flex-1 px-8 lg:px-16 pb-16 space-y-16">
        {/* Founding Members */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          <h3 className="text-lg italic text-foreground font-medium">Founding Members</h3>
          <NameList names={foundingMembers} />
        </div>

        {/* Alumni */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          <h3 className="text-lg italic text-foreground font-medium">Alumni</h3>
          <NameList names={alumni} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
