import { Product } from './product.model';

export interface KitProductSelection {
  product: Product;
  quantity: number; // quantidade em kg ou un
  unitPrice: number;
  subtotal: number;
}

export interface CustomKit {
  id: string;
  name: string;
  items: KitProductSelection[];
  discountPercent: number; // ex: 5% de desconto ao montar kit com 3+ itens
  totalGross: number;
  discountAmount: number;
  totalNet: number;
  createdAt: Date;
}

export interface KitBuilderStep {
  id: 'meats' | 'accessories' | 'drinks';
  title: string;
  subtitle: string;
  categoryFilter: string[];
}

export interface KitValidationResult {
  isValid: boolean;
  distinctCount: number;
  minRequired: number;
  remainingCount: number;
  message: string;
  errors: string[];
}
