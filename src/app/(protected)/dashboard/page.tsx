"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { StatsOverview } from "@/features/dashboard/components/stats-overview";
import { EngagementChart } from "@/features/dashboard/components/engagement-chart";
import { MyArticlesTable } from "@/features/dashboard/components/my-articles-table";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/config/routes";
import type { ArticleStatus } from "@/features/dashboard/types/dashboard.types";

function DashboardContent() {
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">("all");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <Button asChild>
          <Link href={ROUTES.newArticle}>
            <PlusIcon />
            New article
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <DashboardSidebar activeStatus={statusFilter} onStatusChange={setStatusFilter} />

        <div className="space-y-8">
          <StatsOverview />
          <EngagementChart />
          <MyArticlesTable statusFilter={statusFilter} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate minimumRole="AUTHOR">
      <DashboardContent />
    </AuthGate>
  );
}
