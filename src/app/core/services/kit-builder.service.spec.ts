import { describe, it, expect, beforeEach } from 'vitest';
import { KitBuilderService, validateKitRules, MIN_DISTINCT_KIT_COMPONENTS, CUSTOM_KIT_DISCOUNT_PERCENT } from './kit-builder.service';
import { Product } from '../models/product.model';
import { KitProductSelection } from '../models/kit.model';

describe('KitBuilderService & Domain Validation Rules', () => {
  let service: KitBuilderService;

  const mockProduct1: Product = {
    id: 'prod-picanha',
    name: 'Picanha Angus',
    category: 'bovinos',
    description: 'Corte nobre cru',
    price: 100.0,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: '',
    inStock: true,
    stockQuantity: 10
  };

  const mockProduct2: Product = {
    id: 'prod-carvao',
    name: 'Carvão Vegetal 3kg',
    category: 'carvao-acendedores',
    description: 'Carvão premium',
    price: 20.0,
    unit: 'pacote',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 10,
    imageUrl: '',
    inStock: true,
    stockQuantity: 10
  };

  const mockProduct3: Product = {
    id: 'prod-sal',
    name: 'Sal de Parrilla 500g',
    category: 'sais-temperos',
    description: 'Sal entrefino',
    price: 15.0,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 10,
    imageUrl: '',
    inStock: true,
    stockQuantity: 10
  };

  beforeEach(() => {
    service = new KitBuilderService();
    service.clearKit();
  });

  it('should be invalid when empty', () => {
    const val = service.validation();
    expect(val.isValid).toBe(false);
    expect(val.distinctCount).toBe(0);
    expect(val.remainingCount).toBe(MIN_DISTINCT_KIT_COMPONENTS);
  });

  it('should be INVALID when selecting multiple quantities of the SAME product (rule of distinct items)', () => {
    // 3 unidades do mesmo pacote de carvão NÃO atendem à regra de 3 itens distintos
    const items: KitProductSelection[] = [
      {
        product: mockProduct2,
        quantity: 3,
        unitPrice: 20.0,
        subtotal: 60.0
      }
    ];

    const result = validateKitRules(items);
    expect(result.distinctCount).toBe(1);
    expect(result.isValid).toBe(false);
    expect(result.remainingCount).toBe(2);
  });

  it('should be VALID when selecting at least 3 DISTINCT products', () => {
    // 1 Picanha + 1 Carvão + 1 Sal de Parrilla = 3 produtos distintos
    service.addProduct(mockProduct1, 1.0);
    service.addProduct(mockProduct2, 1);
    service.addProduct(mockProduct3, 1);

    const val = service.validation();
    expect(val.distinctCount).toBe(3);
    expect(val.isValid).toBe(true);
    expect(val.remainingCount).toBe(0);
  });

  it('should calculate 5% discount when kit is valid with 3+ items', () => {
    // Picanha R$ 100 + Carvão R$ 20 + Sal R$ 15 = R$ 135 bruto
    // 5% de R$ 135 = R$ 6.75
    // Total líquido = R$ 128.25
    service.addProduct(mockProduct1, 1.0);
    service.addProduct(mockProduct2, 1);
    service.addProduct(mockProduct3, 1);

    expect(service.totalGross()).toBe(135.0);
    expect(service.discountPercent()).toBe(CUSTOM_KIT_DISCOUNT_PERCENT);
    expect(service.discountAmount()).toBe(6.75);
    expect(service.totalNet()).toBe(128.25);
  });

  it('should dynamically invalidate if a product is removed below 3 items', () => {
    service.addProduct(mockProduct1, 1.0);
    service.addProduct(mockProduct2, 1);
    service.addProduct(mockProduct3, 1);

    expect(service.validation().isValid).toBe(true);

    // Remove 1 produto
    service.removeProduct(mockProduct3.id);

    expect(service.validation().isValid).toBe(false);
    expect(service.distinctCount()).toBe(2);
    expect(service.validation().remainingCount).toBe(1);
    expect(service.buildCustomKit()).toBeNull();
  });
});
