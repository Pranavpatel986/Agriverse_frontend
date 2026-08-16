"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "@/shared/lib/query/query-client";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

/**
 * Every cross-cutting client concern is composed in exactly one place.
 * Order matters: ThemeProvider outermost (so even error boundaries below
 * it render themed), then QueryClientProvider (AuthProvider's session
 * bootstrap uses TanStack Query... actually AuthProvider calls the
 * service directly, but keeping QueryClientProvider above AuthProvider
 * means any hook AuthProvider itself grows to use later stays valid).
 */
export function Providers({ children }: { children: ReactNode }) {
  // useState (not a module-level singleton) so each browser tab/SSR
  // request gets its own client and server-rendered data never leaks
  // across requests — the standard TanStack Query + Next.js App Router
  // pattern.
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors closeButton />
          </TooltipProvider>
        </AuthProvider>
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
