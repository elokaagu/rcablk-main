import Link from "next/link";

/** Renders Support page paragraphs; links the phrase "contact us" in the final paragraph to /contact. */
export function SupportBody({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((text, i) => {
        const isLast = i === paragraphs.length - 1;
        if (isLast && /contact us/i.test(text)) {
          const m = text.match(/contact us/i);
          if (m && m.index !== undefined && m[0]) {
            const idx = m.index;
            const before = text.slice(0, idx);
            const after = text.slice(idx + m[0].length);
            return (
              <p key={i}>
                {before}
                <Link
                  href="/contact"
                  className="underline decoration-black/50 underline-offset-[0.15em] hover:opacity-80"
                >
                  contact us
                </Link>
                {after}
              </p>
            );
          }
        }
        return <p key={i}>{text}</p>;
      })}
    </>
  );
}
