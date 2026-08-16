import Link from "next/link";
import {
  BeefIcon,
  BugIcon,
  LandmarkIcon,
  LeafIcon,
  SproutIcon,
  TractorIcon,
  DropletIcon,
  WarehouseIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/config/routes";

interface CategoryCardProps {
  name: string;
  slug: string;
  articleCount?: number;
  className?: string;
}

/**
 * Every category previously rendered the exact same leaf icon — visually
 * flat when shown as a grid of 8 identical circles. This is a real,
 * top-level component with statically-written JSX per branch (rather
 * than selecting a component *reference* and rendering `<Icon />`,
 * which React Compiler's static-components rule correctly flags — a
 * dynamically-chosen component identity can reset state across
 * renders). Falls back to the leaf icon for anything that doesn't
 * match a known theme, so new/uncommon category names never render
 * broken.
 */
function CategoryIcon({ name, className }: { name: string; className?: string }) {
  if (/crop|farming|grain|cereal/i.test(name)) return <SproutIcon className={className} />;
  if (/disease|health|pest|pathogen/i.test(name)) return <BugIcon className={className} />;
  if (/livestock|dairy|cattle|poultry/i.test(name)) return <BeefIcon className={className} />;
  if (/machinery|equipment|tractor/i.test(name)) return <TractorIcon className={className} />;
  if (/scheme|finance|subsidy|loan/i.test(name)) return <LandmarkIcon className={className} />;
  if (/irrigation|water/i.test(name)) return <DropletIcon className={className} />;
  if (/storage|warehouse|post.?harvest/i.test(name)) return <WarehouseIcon className={className} />;
  return <LeafIcon className={className} />;
}

export function CategoryCard({ name, slug, articleCount, className }: CategoryCardProps) {
  return (
    <Link
      href={ROUTES.category(slug)}
      className={cn(
        "group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-canopy-100 text-canopy-700 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <CategoryIcon name={name} className="size-6" />
      </span>
      <span className="text-sm font-medium text-foreground">{name}</span>
      {typeof articleCount === "number" && (
        <span className="text-xs text-muted-foreground">{articleCount} articles</span>
      )}
    </Link>
  );
}
