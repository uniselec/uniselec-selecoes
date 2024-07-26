

export interface Results {
    data:  Patient[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  Patient;
}

export interface Patient {
    id:              number;
    name:            string;
    email:           string;
    login:           string;
    role:            string;
    division_id:      number | null;
    division_sig:     null | string;
    division_sig_id:   number | null;
    email_verified_at: null | string;
    created_at: null | string;
    updated_at: null | string;
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

export interface PatientParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}