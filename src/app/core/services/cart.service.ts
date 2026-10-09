import { Injectable, signal, computed } from '@angular/core';
import { CartItem, CartSummary } from '../models/cart.model';
import { Product } from '../models/product.model';
import { CustomKit } from '../models/kit.model';
import { Coupon } from '../models/coupon.model';
import { MOCK_COUPONS } from '../data/mock-data';

const CART_STORAGE_KEY = 'delivery_mane_cart_v1';
const FREE_DELIVERY_THRESHOLD = 200.0;
const DEFAULT_DELIVERY_FEE = 14.90;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly items = signal<CartItem[]>(this.loadCartFromStorage());
  readonly isDrawerOpen = signal<boolean>(false);
  readonly appliedCoupon = signal<Coupon | null>(null);
  readonly availableCoupons = signal<Coupon[]>(MOCK_COUPONS);

  // Computeds
  readonly itemsCount = computed(() => this.items().length);

  readonly totalItemsQuantity = computed(() => {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly subtotal = computed<number>(() => {
    const raw = this.items().reduce((acc, item) => acc + item.subtotal, 0);
    return Math.round(raw * 100) / 100;
  });

  readonly couponDiscount = computed<number>(() => {
    const coupon = this.appliedCoupon();
    if (!coupon) return 0;

    const sub = this.subtotal();
    if (coupon.minOrderValue && sub < coupon.minOrderValue) {
      return 0;
    }

    let disc = 0;
    if (coupon.discountType === 'percentage') {
      disc = (sub * coupon.value) / 100;
    } else {
      disc = coupon.value;
    }

    if (coupon.maxDiscount && disc > coupon.maxDiscount) {
      disc = coupon.maxDiscount;
    }

    return Math.round(Math.min(sub, disc) * 100) / 100;
  });

  readonly isFreeDelivery = computed<boolean>(() => {
    return this.subtotal() >= FREE_DELIVERY_THRESHOLD;
  });

  readonly amountRemainingForFreeDelivery = computed<number>(() => {
    const remaining = FREE_DELIVERY_THRESHOLD - this.subtotal();
    return Math.max(0, Math.round(remaining * 100) / 100);
  });

  readonly estimatedDeliveryFee = computed<number>(() => {
    if (this.isFreeDelivery() || this.itemsCount() === 0) return 0;
    return DEFAULT_DELIVERY_FEE;
  });

  readonly total = computed<number>(() => {
    const total = this.subtotal() - this.couponDiscount();
    return Math.max(0, Math.round(total * 100) / 100);
  });

  readonly summary = computed<CartSummary>(() => {
    return {
      itemsCount: this.itemsCount(),
      totalItemsQuantity: this.totalItemsQuantity(),
      subtotal: this.subtotal(),
      discount: this.couponDiscount(),
      deliveryFee: this.estimatedDeliveryFee(),
      total: this.total(),
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountRemainingForFreeDelivery: this.amountRemainingForFreeDelivery()
    };
  });

  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  }

  private saveCart(items: CartItem[]) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  openDrawer() {
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer() {
    this.isDrawerOpen.update(v => !v);
  }

  // Adicionar produto individual
  addProduct(product: Product, quantityOrWeight: number = 1, notes?: string) {
    const existingIndex = this.items().findIndex(
      item => item.type === 'single-product' && item.product?.id === product.id
    );

    if (existingIndex > -1) {
      this.items.update(current => {
        const updated = [...current];
        const existing = updated[existingIndex];
        const newWeight = Math.round((existing.itemWeightOrUnit! + quantityOrWeight) * 100) / 100;
        const subtotal = Math.round(product.price * newWeight * 100) / 100;
        updated[existingIndex] = {
          ...existing,
          itemWeightOrUnit: newWeight,
          subtotal
        };
        this.saveCart(updated);
        return updated;
      });
    } else {
      const subtotal = Math.round(product.price * quantityOrWeight * 100) / 100;
      const newItem: CartItem = {
        id: 'cart-item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: 'single-product',
        product,
        quantity: 1,
        itemWeightOrUnit: quantityOrWeight,
        unitPrice: product.price,
        subtotal,
        notes
      };

      this.items.update(current => {
        const updated = [...current, newItem];
        this.saveCart(updated);
        return updated;
      });
    }

    this.openDrawer();
  }

  // Adicionar Kit montado
  addCustomKit(kit: CustomKit) {
    const newItem: CartItem = {
      id: 'cart-kit-' + Date.now(),
      type: 'custom-kit',
      customKit: kit,
      quantity: 1,
      unitPrice: kit.totalNet,
      subtotal: kit.totalNet
    };

    this.items.update(current => {
      const updated = [...current, newItem];
      this.saveCart(updated);
      return updated;
    });

    this.openDrawer();
  }

  updateItemQuantity(itemId: string, newQuantityOrWeight: number) {
    if (newQuantityOrWeight <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.items.update(current => {
      const updated = current.map(item => {
        if (item.id === itemId) {
          if (item.type === 'single-product' && item.product) {
            const weight = newQuantityOrWeight;
            const subtotal = Math.round(item.unitPrice * weight * 100) / 100;
            return { ...item, itemWeightOrUnit: weight, subtotal };
          } else {
            const qty = Math.floor(newQuantityOrWeight);
            const subtotal = Math.round(item.unitPrice * qty * 100) / 100;
            return { ...item, quantity: qty, subtotal };
          }
        }
        return item;
      });
      this.saveCart(updated);
      return updated;
    });
  }

  removeItem(itemId: string) {
    this.items.update(current => {
      const updated = current.filter(i => i.id !== itemId);
      this.saveCart(updated);
      return updated;
    });
  }

  clearCart() {
    this.items.set([]);
    this.appliedCoupon.set(null);
    this.saveCart([]);
  }

  applyCoupon(code: string): { success: boolean; message: string } {
    const trimmed = code.trim().toUpperCase();
    const coupon = this.availableCoupons().find(c => c.code === trimmed && c.active);

    if (!coupon) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }

    if (coupon.minOrderValue && this.subtotal() < coupon.minOrderValue) {
      return {
        success: false,
        message: `Este cupom requer pedido mínimo de R$ ${coupon.minOrderValue.toFixed(2).replace('.', ',')}.`
      };
    }

    this.appliedCoupon.set(coupon);
    return { success: true, message: `Cupom ${coupon.code} aplicado com sucesso!` };
  }

  removeCoupon() {
    this.appliedCoupon.set(null);
  }
}
