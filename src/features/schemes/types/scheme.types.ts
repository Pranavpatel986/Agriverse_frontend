import type { IsoDateTime, PublicId } from "@/shared/types/api";
import type { CropRef } from "@/features/diseases/types/disease.types";

export interface SchemeSummary {
  id: PublicId;
  name: string;
  beneficiaryType: string;
  state?: string;
  benefitSummary: string;
  applicationDeadline?: string; // date, not date-time
}

export interface SchemeDetail {
  id: PublicId;
  name: string;
  description: string;
  beneficiaryType: string;
  state?: string;
  crop?: CropRef;
  benefitSummary: string;
  applicationDeadline?: string;
  officialUrl: string;
  source: string;
  lastVerifiedAt?: IsoDateTime;
}

export interface SchemeListParams {
  state?: string;
  cropId?: string;
  beneficiaryType?: string;
  page?: number;
  size?: number;
}

export interface SchemeFormValues {
  name: string;
  description: string;
  beneficiaryType: string;
  state?: string;
  cropId?: string;
  benefitSummary: string;
  applicationDeadline?: string;
  officialUrl: string;
  source: string;
}
