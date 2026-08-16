"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--canopy-50)",
          "--success-text": "var(--canopy-800)",
          "--error-bg": "var(--clay-100)",
          "--error-text": "var(--clay-700)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
