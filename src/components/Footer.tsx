import Link from "next/link";

const Footer = () => {
  const columns = [
    {
      items: ["Royal College of Art", "Kensington Gore", "London, SW7 2EU"],
    },
    {
      items: [
        { label: "Events", href: "/events" },
        { label: "News", href: "/news" },
        { label: "Support", href: "/support" },
      ],
    },
    {
      items: [
        { label: "Accessibility", href: "/accessibility" },
        { label: "Terms & Conditions", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
    {
      items: [
        { label: "Contact", href: "/contact" },
        { label: "Instagram", href: "https://www.instagram.com/rcablk/", external: true },
      ],
    },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground px-8 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-2">
            {col.items.map((item, j) =>
              typeof item === "string" ? (
                <span key={j}>{item}</span>
              ) : "external" in item && item.external ? (
                <a
                  key={j}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline cursor-pointer"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={j}
                  href={item.href}
                  className="hover:underline cursor-pointer no-underline"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        ))}
        <div className="flex flex-col items-end justify-start gap-1">
          <span className="text-2xl font-bold">♛</span>
          <span className="text-xs font-semibold">Royal College of Art</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
