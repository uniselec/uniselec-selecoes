export interface Results {
  data: Application[];
  links: Links;
  meta: Meta;
}

export interface Result {
  data: Application;
}

export interface Application {
  id: string;
  data: {
    // Dados pessoais
    name: string;
    social_name?: string;
    cpf: string;
    enem: string;
    enem_year?: number;
    birtdate: string;
    sex: string;
    email: string;
    phone1: string;
    phone2?: string;
    address: string;
    uf: string;
    city: string;

    // Dados da candidatura
    edital: string;
    course: string;               // id do curso
    campus: string;               // nome do campus
    position: string;             // nome do curso (posição)
    location_position: string;    // nome da unidade acadêmica
    modalidade: string[];         // lista de categorias de admissão
    bonus: string;                // critério de bonificação selecionado

    // Confirmações
    publicSchool: boolean;
    termsAgreement: boolean;

    updated_at?: string;
  };
  verification_expected: string;
  verification_code: string;
  valid_verification_code: boolean;
  created_at: string | null;
  updated_at: string | null;
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
