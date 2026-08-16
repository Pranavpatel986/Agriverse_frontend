import type { PublicId } from "@/shared/types/api";

export type Severity = "low" | "medium" | "high" | string;
export type PathogenType = "fungal" | "bacterial" | "viral" | "pest" | string;

export interface CropRef {
  id: PublicId;
  name: string;
}

export interface ArticleRef {
  id: PublicId;
  slug: string;
  title: string;
}

export interface DiseaseSummary {
  id: PublicId;
  name: string;
  pathogenType: PathogenType;
  severity: Severity;
  crops: CropRef[];
}

export interface DiseaseDetail {
  id: PublicId;
  name: string;
  pathogenType: PathogenType;
  severity: Severity;
  symptoms: string;
  treatment: string;
  prevention?: string;
  crops: CropRef[];
  article?: ArticleRef;
}

export interface DiseaseListParams {
  symptom?: string;
  cropId?: string;
  pathogenType?: string;
  severity?: string;
  page?: number;
  size?: number;
}

export interface DiseaseFormValues {
  name: string;
  pathogenType: string;
  severity: string;
  symptoms: string;
  treatment: string;
  prevention?: string;
  cropIds: string[];
  articleId?: string;
}
