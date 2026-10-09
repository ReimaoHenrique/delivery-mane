export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number; // ex: 10 (10%) ou 15 (R$ 15,00)
  minOrderValue?: number;
  maxDiscount?: number;
  active: boolean;
  validUntil?: Date;
}
