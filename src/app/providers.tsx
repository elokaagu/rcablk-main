"use client";

import dynamic from "next/dynamic";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookieBanner } from "@/components/CookieBanner";
import { useState } from "react";

const Toaster = dynamic(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })), { ssr: false });
const Sonner = dynamic(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <CookieBanner />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
