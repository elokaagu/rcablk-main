export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" aria-live="polite" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        <p className="text-base text-foreground/70">Loading...</p>
      </div>
    </div>
  );
}
