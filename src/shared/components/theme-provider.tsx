"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes renders a raw <script> tag internally (not via next/script)
 * to set the theme class before hydration and avoid a flash of the wrong
 * theme. React 19 added a dev-only warning for any <script> tag rendered
 * inside a Client Component — this trips on next-themes' by-design use of
 * one, even though it works correctly. next-themes hasn't shipped a fix as
 * of this writing (github.com/pacocoursey/next-themes/issues/385, #387);
 * this filters just that one message rather than the noisier alternative
 * of muting all console.error output, so a real error is never hidden by
 * this. Remove once next-themes addresses it upstream.
 */
if (typeof window !== "undefined") {
  const flagged = "__agriverseNextThemesScriptWarningFiltered";
  if (!(window as unknown as Record<string, boolean>)[flagged]) {
    (window as unknown as Record<string, boolean>)[flagged] = true;
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Encountered a script tag while rendering React component")
      ) {
        return;
      }
      originalConsoleError(...args);
    };
  }
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
