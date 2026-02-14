import Link from "next/link";
import SlideOutMenu from "@/components/SlideOutMenu";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <SlideOutMenu />
      <div className="flex-1 flex items-center justify-center px-4" id="main-content">
        <div className="text-center max-w-md">
          <h1 className="mb-4 text-4xl sm:text-5xl font-display font-bold text-foreground">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">The page you’re looking for doesn’t exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="px-6 py-3 font-display font-medium text-background bg-foreground hover:opacity-90 transition-opacity"
            >
              Return to Home
            </Link>
            <Link
              href="/events"
              className="text-foreground underline hover:opacity-70 transition-opacity"
            >
              Browse Events
            </Link>
            <Link
              href="/news"
              className="text-foreground underline hover:opacity-70 transition-opacity"
            >
              Read News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
