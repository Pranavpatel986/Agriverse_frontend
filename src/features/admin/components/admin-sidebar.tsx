"use client";

import {
  BarChart3Icon,
  FileTextIcon,
  MessageSquareWarningIcon,
  UsersIcon,
  LandmarkIcon,
  BugIcon,
  TractorIcon,
  FolderTreeIcon,
  SproutIcon,
  MapIcon,
  HelpCircleIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type AdminSection =
  | "overview"
  | "articles"
  | "comments"
  | "users"
  | "schemes"
  | "diseases"
  | "machinery"
  | "categories"
  | "crops"
  | "roadmaps"
  | "quizzes";

const SECTIONS: { value: AdminSection; label: string; icon: typeof BarChart3Icon }[] = [
  { value: "overview", label: "Analytics", icon: BarChart3Icon },
  { value: "articles", label: "Articles", icon: FileTextIcon },
  { value: "comments", label: "Comments", icon: MessageSquareWarningIcon },
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "categories", label: "Categories", icon: FolderTreeIcon },
  { value: "crops", label: "Crops", icon: SproutIcon },
  { value: "schemes", label: "Schemes", icon: LandmarkIcon },
  { value: "diseases", label: "Diseases", icon: BugIcon },
  { value: "machinery", label: "Machinery", icon: TractorIcon },
  { value: "roadmaps", label: "Roadmaps", icon: MapIcon },
  { value: "quizzes", label: "Quizzes", icon: HelpCircleIcon },
];

export function AdminSidebar({
  active,
  onChange,
}: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}) {
  return (
    <nav
      aria-label="Admin sections"
      className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
    >
      {SECTIONS.map((section) => (
        <button
          key={section.value}
          type="button"
          onClick={() => onChange(section.value)}
          aria-current={active === section.value ? "page" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            active === section.value
              ? "bg-canopy-100 text-canopy-800"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <section.icon className="size-4" />
          {section.label}
        </button>
      ))}
    </nav>
  );
}
