import { describe, it, expect, beforeEach } from 'vitest';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 'prod-ancho',
    name: 'Ancho Angus',
    category: 'bovinos',
    description: 'Bife de costela cru',
    price: 80.0,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: '',
    inStock: true,
    stockQuantity: 10
  };

  beforeEach(() => {
    service = new CartService();
    service.clearCart();
  });

  it('should allow single product purchase (traditional delivery) without kit restrictions', () => {
    // Delivery tradicional pode comprar 1 único corte de carne
    service.addProduct(mockProduct, 1.5);

    expect(service.itemsCount()).toBe(1);
    expect(service.subtotal()).toBe(120.0); // 1.5kg * R$ 80,00 = R$ 120,00
  });

  it('should apply discount coupon when minimum order value is met', () => {
    service.addProduct(mockProduct, 2.0); // R$ 160,00
    const res = service.applyCoupon('MANE10'); // 10% OFF, min R$ 80

    expect(res.success).toBe(true);
    expect(service.couponDiscount()).toBe(16.0); // 10% de R$ 160 = R$ 16,00
    expect(service.total()).toBe(144.0);
  });

  it('should calculate free delivery when subtotal >= R$ 200', () => {
    service.addProduct(mockProduct, 2.0); // R$ 160,00
    expect(service.isFreeDelivery()).toBe(false);
    expect(service.amountRemainingForFreeDelivery()).toBe(40.0);

    service.addProduct(mockProduct, 1.0); // Total 3.0kg = R$ 240,00
    expect(service.isFreeDelivery()).toBe(true);
    expect(service.amountRemainingForFreeDelivery()).toBe(0);
  });
});
