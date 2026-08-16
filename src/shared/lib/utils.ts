import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class lists safely (later classes win over conflicting
 * earlier ones) while allowing conditional class objects/arrays via clsx.
 * Used by every component in the design system instead of raw template
 * strings, so conditional styling never produces duplicate/conflicting
 * Tailwind utilities.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic heading → anchor id, used by both RichTextViewer (to set
 * the id) and TableOfContents (to build matching hrefs) so the two never
 * drift out of sync despite being separate components.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(amount: number): string {
  return inrFormatter.format(amount);
}

/** Always rendered as plain text (e.g. "₹15,000–₹35,000") — never
 *  conveyed through icon/color alone, per the Machinery Directory's
 *  a11y requirement. */
export function formatPriceRange(min?: number, max?: number): string {
  if (min == null && max == null) return "Price not listed";
  if (min != null && max != null) return `${formatInr(min)}–${formatInr(max)}`;
  return formatInr((min ?? max) as number);
}
