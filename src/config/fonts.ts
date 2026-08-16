import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

/**
 * Three type roles (see globals.css theme block for how these map to
 * font-display / font-sans / font-mono utilities):
 *  - Fraunces        → display/headline face. Used with restraint (h1-h3,
 *                      hero) — a characterful serif that reads as editorial
 *                      knowledge-platform rather than generic SaaS.
 *  - Inter            → body/UI workhorse. Everything else: nav, forms,
 *                      tables, buttons. Optimized for legibility on
 *                      low-end/rural devices per the Product Spec.
 *  - JetBrains Mono   → data/precision face. Prices, dosages, timestamps,
 *                      IDs — anywhere numeric accuracy matters visually.
 */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
