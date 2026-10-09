import { Product } from './product.model';
import { CustomKit } from './kit.model';

export type CartItemType = 'single-product' | 'custom-kit' | 'predefined-kit';

export interface CartItem {
  id: string; // único para a linha do carrinho
  type: CartItemType;
  product?: Product;
  customKit?: CustomKit;
  quantity: number; // quantidade de unidades do produto/kit
  itemWeightOrUnit?: number; // para carnes vendidas por kg (ex: 1.5kg)
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface CartSummary {
  itemsCount: number;
  totalItemsQuantity: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  freeDeliveryThreshold: number;
  amountRemainingForFreeDelivery: number;
}
