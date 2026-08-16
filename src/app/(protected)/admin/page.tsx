"use client";

import { useState } from "react";
import {
  AdminSidebar,
  type AdminSection,
} from "@/features/admin/components/admin-sidebar";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ArticleModerationTable } from "@/features/admin/components/article-moderation-table";
import { CommentModerationQueue } from "@/features/admin/components/comment-moderation-queue";
import { UserManagementTable } from "@/features/admin/components/user-management-table";
import { SchemeManagementPanel } from "@/features/schemes/components/scheme-management-panel";
import { DiseaseManagementPanel } from "@/features/diseases/components/disease-management-panel";
import { MachineryManagementPanel } from "@/features/machinery/components/machinery-management-panel";
import { CategoryManagementPanel } from "@/features/categories/components/category-management-panel";
import { CropManagementPanel } from "@/features/crops/components/crop-management-panel";
import { RoadmapManagementPanel } from "@/features/roadmaps/components/roadmap-management-panel";
import { QuizManagementPanel } from "@/features/quiz/components/quiz-management-panel";
import { StatsOverview } from "@/features/dashboard/components/stats-overview";
import { EngagementChart } from "@/features/dashboard/components/engagement-chart";
import { AuthGate } from "@/features/auth/components/auth-gate";

/**
 * Each section is mounted only when active — per the spec's "a slow
 * analytics query never blocks moderation actions" loading requirement,
 * this also means switching sections never triggers unrelated fetches.
 */
function AdminSectionContent({ section }: { section: AdminSection }) {
  switch (section) {
    case "overview":
      return (
        <div className="space-y-6">
          <StatsOverview />
          <EngagementChart />
        </div>
      );
    case "articles":
      return <ArticleModerationTable />;
    case "comments":
      return <CommentModerationQueue />;
    case "users":
      return <UserManagementTable />;
    case "schemes":
      return <SchemeManagementPanel />;
    case "diseases":
      return <DiseaseManagementPanel />;
    case "machinery":
      return <MachineryManagementPanel />;
    case "categories":
      return <CategoryManagementPanel />;
    case "crops":
      return <CropManagementPanel />;
    case "roadmaps":
      return <RoadmapManagementPanel />;
    case "quizzes":
      return <QuizManagementPanel />;
  }
}

function AdminPageContent() {
  const [section, setSection] = useState<AdminSection>("overview");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <AdminTopbar />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_1fr]">
        <AdminSidebar active={section} onChange={setSection} />
        <div>
          <AdminSectionContent section={section} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGate minimumRole="EDITOR">
      <AdminPageContent />
    </AuthGate>
  );
}
