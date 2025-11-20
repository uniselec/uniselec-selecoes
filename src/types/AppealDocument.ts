export interface AppealDocument {
  id?: number;
  appeal_id?: number;
  path: string;
  original_name: string;
  created_at?: null | string;
  updated_at?: null | string;
}

export interface Result {
  data: AppealDocument;
}
