import Link from "next/link";
import { SupportPageEditor } from "./SupportPageEditor";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StudioPageEdit({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/studio/pages" className="text-sm text-amber-400 hover:underline">
            ← Site pages
          </Link>
          <h1 className="mt-2 font-serif text-3xl text-white">Edit: {decoded}</h1>
        </div>
      </div>
      <SupportPageEditor slug={decoded} />
    </div>
  );
}
