export function DesignCredits({ className = "" }: { className?: string }) {
  return (
    <dl
      className={`flex flex-col gap-1 font-serif text-base leading-snug tracking-brand text-black sm:text-[1.05rem] ${className}`}
    >
      <div className="flex gap-2">
        <dt className="font-normal">Identity:</dt>
        <dd>Studio Frith</dd>
      </div>
      <div className="flex gap-2">
        <dt className="font-normal">Web Development:</dt>
        <dd>
          <a
            href="https://www.satellitelabs.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="link-offset-underline"
          >
            Satellite Labs
          </a>
        </dd>
      </div>
    </dl>
  );
}
