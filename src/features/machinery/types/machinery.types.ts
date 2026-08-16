import type { PublicId } from "@/shared/types/api";
import type { ArticleRef, CropRef } from "@/features/diseases/types/disease.types";

export interface MachinerySummary {
  id: PublicId;
  name: string;
  category: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
}

export interface MachineryDetail {
  id: PublicId;
  name: string;
  category: string;
  description: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  applicableCrop?: CropRef;
  article?: ArticleRef;
}

export interface MachineryListParams {
  category?: string;
  cropId?: string;
  page?: number;
  size?: number;
}

export interface MachineryFormValues {
  name: string;
  category: string;
  description: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  applicableCropId?: string;
  articleId?: string;
}
