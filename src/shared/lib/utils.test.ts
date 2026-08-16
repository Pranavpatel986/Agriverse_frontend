import { describe, expect, it } from "vitest";
import { cn, formatInr, formatPriceRange, slugifyHeading } from "./utils";

describe("cn", () => {
  it("merges class lists and lets the later conflicting utility win", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("drops falsy values from conditional class objects", () => {
    expect(cn("base", false && "hidden", undefined, "visible")).toBe("base visible");
  });
});

describe("slugifyHeading", () => {
  it("lowercases, trims, and hyphenates", () => {
    expect(slugifyHeading("  Best Practices for Drip Irrigation  ")).toBe(
      "best-practices-for-drip-irrigation",
    );
  });

  it("strips punctuation that isn't a hyphen", () => {
    expect(slugifyHeading("What's the ROI? (2026 update)")).toBe(
      "whats-the-roi-2026-update",
    );
  });

  it("collapses repeated whitespace into a single hyphen", () => {
    expect(slugifyHeading("too    many     spaces")).toBe("too-many-spaces");
  });
});

describe("formatInr", () => {
  it("formats as INR with no decimal places", () => {
    // en-IN grouping (lakh/crore commas) — assert on the digits/currency
    // symbol rather than exact comma placement, which varies by ICU data.
    const formatted = formatInr(150000);
    expect(formatted).toContain("₹");
    expect(formatted).not.toContain(".");
  });
});

describe("formatPriceRange", () => {
  it("renders an en-dash range when both bounds are present", () => {
    expect(formatPriceRange(15000, 35000)).toBe(
      `${formatInr(15000)}–${formatInr(35000)}`,
    );
  });

  it("renders a single value when only one bound is present", () => {
    expect(formatPriceRange(15000, undefined)).toBe(formatInr(15000));
    expect(formatPriceRange(undefined, 35000)).toBe(formatInr(35000));
  });

  it("falls back to a plain-text message when neither bound exists", () => {
    expect(formatPriceRange(undefined, undefined)).toBe("Price not listed");
  });
});
