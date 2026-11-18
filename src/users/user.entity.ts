import { BrandingConfig } from '@src/branding/branding.config';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  blocked: boolean;
  type: string;
  phone: string;
  personal_id?: string;
  branding?: BrandingConfig;
}

export class Student extends User {
  personal_id: string;
  birthdate: string;
  weight: number;
  height: number;
  monthly_value_brl: number;
}

export class Personal extends User {
  subscription_id: string;
}
