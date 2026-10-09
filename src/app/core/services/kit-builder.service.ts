import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { KitProductSelection, CustomKit, KitValidationResult } from '../models/kit.model';

export const MIN_DISTINCT_KIT_COMPONENTS = 3;
export const CUSTOM_KIT_DISCOUNT_PERCENT = 5; // 5% de desconto especial em kits montados com 3+ itens

export function validateKitRules(items: KitProductSelection[]): KitValidationResult {
  const distinctProductIds = new Set(items.map(item => item.product.id));
  const distinctCount = distinctProductIds.size;
  const minRequired = MIN_DISTINCT_KIT_COMPONENTS;
  const remainingCount = Math.max(0, minRequired - distinctCount);
  const isValid = distinctCount >= minRequired;

  const errors: string[] = [];
  if (!isValid) {
    if (distinctCount === 0) {
      errors.push(`Selecione pelo menos ${minRequired} produtos diferentes para montar o seu kit.`);
    } else {
      errors.push(
        `Faltam ${remainingCount} ${remainingCount === 1 ? 'produto diferente' : 'produtos diferentes'} para atingir o mínimo de ${minRequired}.`
      );
    }
  }

  let message = '';
  if (isValid) {
    message = `Parabéns! Você atingiu o mínimo de ${minRequired} itens distintos (${distinctCount} selecionados). Desconto de ${CUSTOM_KIT_DISCOUNT_PERCENT}% aplicado!`;
  } else {
    message = `Você selecionou ${distinctCount} de ${minRequired} componentes mínimos necessários.`;
  }

  return {
    isValid,
    distinctCount,
    minRequired,
    remainingCount,
    message,
    errors
  };
}

@Injectable({
  providedIn: 'root'
})
export class KitBuilderService {
  readonly selectedItems = signal<KitProductSelection[]>([]);
  readonly kitName = signal<string>('Meu Kit Churrasco Personalizado');

  readonly distinctCount = computed(() => {
    return new Set(this.selectedItems().map(item => item.product.id)).size;
  });

  readonly validation = computed<KitValidationResult>(() => {
    return validateKitRules(this.selectedItems());
  });

  readonly totalGross = computed<number>(() => {
    return this.selectedItems().reduce((acc, item) => acc + item.subtotal, 0);
  });

  readonly discountPercent = computed<number>(() => {
    return this.validation().isValid ? CUSTOM_KIT_DISCOUNT_PERCENT : 0;
  });

  readonly discountAmount = computed<number>(() => {
    const gross = this.totalGross();
    const percent = this.discountPercent();
    return Math.round(gross * (percent / 100) * 100) / 100;
  });

  readonly totalNet = computed<number>(() => {
    return Math.max(0, this.totalGross() - this.discountAmount());
  });

  readonly currentStep = signal<'meats' | 'accessories' | 'drinks' | 'summary'>('meats');

  setStep(step: 'meats' | 'accessories' | 'drinks' | 'summary') {
    this.currentStep.set(step);
  }

  getItemByProductId(productId: string): KitProductSelection | undefined {
    return this.selectedItems().find(item => item.product.id === productId);
  }

  isProductSelected(productId: string): boolean {
    return this.selectedItems().some(item => item.product.id === productId);
  }

  addProduct(product: Product, quantity?: number) {
    const existing = this.getItemByProductId(product.id);
    const step = product.unitStep || 1;
    const initialQty = quantity ?? product.minUnit ?? step;

    if (existing) {
      this.updateQuantity(product.id, existing.quantity + step);
    } else {
      const subtotal = Math.round(product.price * initialQty * 100) / 100;
      this.selectedItems.update(items => [
        ...items,
        {
          product,
          quantity: initialQty,
          unitPrice: product.price,
          subtotal
        }
      ]);
    }
  }

  removeProduct(productId: string) {
    this.selectedItems.update(items => items.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    this.selectedItems.update(items => {
      return items.map(item => {
        if (item.product.id === productId) {
          const qty = Math.min(item.product.maxUnit || 99, Math.max(item.product.minUnit || 0.5, newQuantity));
          const subtotal = Math.round(item.unitPrice * qty * 100) / 100;
          return {
            ...item,
            quantity: qty,
            subtotal
          };
        }
        return item;
      });
    });
  }

  clearKit() {
    this.selectedItems.set([]);
    this.kitName.set('Meu Kit Churrasco Personalizado');
    this.currentStep.set('meats');
  }

  buildCustomKit(): CustomKit | null {
    const val = this.validation();
    if (!val.isValid) {
      return null;
    }

    const id = 'kit-' + Date.now();
    return {
      id,
      name: this.kitName() || 'Kit de Churrasco Personalizado',
      items: [...this.selectedItems()],
      discountPercent: this.discountPercent(),
      totalGross: this.totalGross(),
      discountAmount: this.discountAmount(),
      totalNet: this.totalNet(),
      createdAt: new Date()
    };
  }

  loadExistingKit(kit: CustomKit) {
    this.kitName.set(kit.name);
    this.selectedItems.set([...kit.items]);
    this.currentStep.set('summary');
  }
}
