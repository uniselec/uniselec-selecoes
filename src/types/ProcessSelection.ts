import { Course } from "./Course";
import { BonusOption } from "./BonusOption";
import { AdmissionCategory } from "./AdmissionCategory";

export interface Results {
    data:  ProcessSelection[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  ProcessSelection;
}

export interface ProcessSelection {
  id?:              string;
  name:            string;
  description:            string;
  status:           string;
  start_date:           string;
  end_date: string;
  appeal_start_date: string;
  appeal_end_date: string;
  preliminary_result_date: string;
  final_result_date: string;
  last_applications_processed_at: string;
  type:           string;
  courses: Course[];
  documents?: Document[];
  bonus_options?: BonusOption[];
  allowed_enem_years?: number[];
  admission_categories?: AdmissionCategory[];
  created_at?: null | string;
  updated_at?: null | string;
}
export interface Links {
  prev: string;
  last: string;
  next: string;
  first: string;
}

export interface Meta {
  to: number;
  from: number;
  path: string;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
}

export interface ProcessSelectionParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}