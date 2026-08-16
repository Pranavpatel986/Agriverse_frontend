"use client";

import Link from "next/link";
import { ShieldIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { useCurrentUser, useHasMinimumRole } from "@/features/auth/hooks/use-role";
import type { ArticleStatus } from "../types/dashboard.types";

const STATUS_FILTERS: { value: ArticleStatus | "all"; label: string }[] = [
  { value: "all", label: "All articles" },
  { value: "draft", label: "Drafts" },
  { value: "in_review", label: "In review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface DashboardSidebarProps {
  activeStatus: ArticleStatus | "all";
  onStatusChange: (status: ArticleStatus | "all") => void;
}

export function DashboardSidebar({
  activeStatus,
  onStatusChange,
}: DashboardSidebarProps) {
  const { user } = useCurrentUser();
  // The full admin panel (user role management, article moderation queue,
  // comments, schemes, diseases, machinery) already exists at /admin —
  // gated the same way there (AuthGate minimumRole="EDITOR"). It was
  // reachable only by typing the URL directly; nothing in the nav ever
  // linked to it. This is that link, shown only to the roles that can
  // actually use it.
  const canAccessAdmin = useHasMinimumRole("EDITOR");
  const initials = user?.fullName
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user?.fullName}</p>
          <p className="text-muted-foreground text-xs capitalize">
            {user?.role.toLowerCase()}
          </p>
        </div>
      </div>

      <nav aria-label="Article status filters">
        <ul className="space-y-1">
          {STATUS_FILTERS.map((filter) => (
            <li key={filter.value}>
              <button
                type="button"
                onClick={() => onStatusChange(filter.value)}
                aria-current={activeStatus === filter.value ? "page" : undefined}
                className={cn(
                  "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                  activeStatus === filter.value
                    ? "bg-canopy-100 text-canopy-800 font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {filter.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {canAccessAdmin && (
        <div className="border-border border-t pt-4">
          <Link
            href="/admin"
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <ShieldIcon className="size-4" />
            Admin panel
          </Link>
        </div>
      )}
    </aside>
  );
}
