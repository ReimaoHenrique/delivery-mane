import { Address } from './address.model';
import { CustomKit } from './kit.model';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate?: string;
  addresses: Address[];
  favoriteKits: CustomKit[];
  favoriteProductIds: string[];
  createdAt: Date;
}

export interface UserSession {
  customer: Customer | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
