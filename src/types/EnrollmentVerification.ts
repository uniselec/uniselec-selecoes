export interface EnrollmentVerification {
  name: string;
  social_name: string | null;
  birthdate: string;
  email: string;
  cpf: string;
  sex: string;
  phone: string;
  address: string;
  city: string;
  uf: string;
  edital: string;
  course: string;
  academic_unit: string;
  enem: string;
  admission_categories: string[];
  bonus: string | null;
  registration_date: string;
  verification_code: string;
}