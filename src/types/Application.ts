export interface Results {
  data: Application[];
  links: Links;
  meta: Meta;
}

export interface Result {
  data: Application;
}

export interface Application {
  id: number;
  data: {
    name: string;
    cpf: string;
    enem: string;
    dob: string;
    sex: string;
    email: string;
    phone1: string;
    phone2?: string;
    address: string;
    uf: string;
    city: string;
    campus: string;
    course: string;
    vaga: string[];
    publicSchool: boolean;
    termsAgreement: boolean;
  };
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

export interface ApplicationParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}
