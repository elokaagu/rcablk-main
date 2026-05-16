/** Centered Jubilat page heading — matches Studio Frith feedback across inner pages. */
export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-center font-serif text-[2rem] font-normal leading-[1.1] tracking-brand text-black sm:text-[2.35rem] md:text-[2.75rem]">
      {children}
    </h1>
  );
}
