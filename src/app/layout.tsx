import type { Metadata } from "next";
import { fontDisplay, fontSans, fontMono } from "@/config/fonts";
import { env } from "@/config/env";
import { Providers } from "./providers";
import "./globals.css";

/**
 * Site-wide SEO defaults. Every page can override individual fields via
 * its own `generateMetadata`/`metadata` export — Next.js deep-merges
 * against this base rather than each page repeating title templates,
 * per the Frontend Technical Specification's SEO requirements.
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "AgriVerse — Agricultural Knowledge Platform",
    template: "%s | AgriVerse",
  },
  description:
    "Structured, practical agricultural knowledge — crop guides, disease diagnosis, government schemes, market prices, and learning roadmaps for Indian farmers.",
  openGraph: {
    type: "website",
    siteName: "AgriVerse",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
