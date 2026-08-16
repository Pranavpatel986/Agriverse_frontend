import type { PublicId } from "@/shared/types/api";

export interface RoadmapSummary {
  id: PublicId;
  title: string;
  slug: string;
  description?: string;
  stepCount: number;
}

export interface RoadmapListParams {
  categorySlug?: string;
  page?: number;
  size?: number;
}

export interface RoadmapProgress {
  completedSteps: number;
  isCompleted: boolean;
}

export interface RoadmapStep {
  id: PublicId;
  order: number;
  title: string;
  articleSlug?: string;
  quizId?: PublicId;
}

export interface RoadmapDetail {
  id: PublicId;
  title: string;
  steps: RoadmapStep[];
  progress?: RoadmapProgress;
}

export interface UpdateRoadmapProgressRequest {
  stepId: PublicId;
  completed: boolean;
}

// --- Admin authoring (RoadmapManagementPanel) ----------------------------

export interface CreateRoadmapStepInput {
  order: number;
  title: string;
}

export interface CreateRoadmapInput {
  title: string;
  description?: string;
  categoryId?: string;
  steps: CreateRoadmapStepInput[];
}
