export interface Appeal {
  application_id: number;
  justification: string;
  decision?: null | string;
  status?: string;
  created_at?: null | string;
  updated_at?: null | string;
}

export interface Result {
  data: Appeal;
}