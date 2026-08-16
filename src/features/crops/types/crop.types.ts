import type { PublicId } from "@/shared/types/api";

export interface Crop {
  id: PublicId;
  name: string;
  scientificName?: string;
  categoryId?: PublicId;
}

export interface CropListParams {
  q?: string;
  categoryId?: string;
  page?: number;
  size?: number;
}

/** CropPageResponse — deliberately NOT the standard PaginatedResponse:
 *  no `totalPages` field, confirmed against the real OpenAPI schema. */
export interface CropPage {
  content: Crop[];
  totalElements: number;
  page: number;
}

// --- Admin CRUD (CropManagementPanel) -----------------------------------

export interface CropFormValues {
  name: string;
  scientificName?: string;
  categoryId?: string;
}
