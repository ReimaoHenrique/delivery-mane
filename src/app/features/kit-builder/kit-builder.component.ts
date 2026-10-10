import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { KitBuilderService, MIN_DISTINCT_KIT_COMPONENTS, CUSTOM_KIT_DISCOUNT_PERCENT } from '../../core/services/kit-builder.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product, ProductCategory } from '../../core/models/product.model';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';
import { UnitFormatPipe } from '../../shared/pipes/unit-format.pipe';

@Component({
  selector: 'app-kit-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyBrlPipe, UnitFormatPipe],
  templateUrl: './kit-builder.component.html',
  styleUrls: ['./kit-builder.component.scss']
})
export class KitBuilderComponent {
  readonly productService = inject(ProductService);
  readonly kitBuilder = inject(KitBuilderService);
  readonly cartService = inject(CartService);
  private readonly toast = inject(NotificationService);
  private readonly router = inject(Router);

  readonly minRequired = MIN_DISTINCT_KIT_COMPONENTS;
  readonly discountPercent = CUSTOM_KIT_DISCOUNT_PERCENT;

  // Filtros de produtos por etapa
  readonly meatsProducts = computed(() => {
    return this.productService.allProducts().filter(p => 
      p.category === 'bovinos' || 
      p.category === 'suinos' || 
      p.category === 'aves' || 
      p.category === 'linguicas-espetinhos'
    );
  });

  readonly accessoriesProducts = computed(() => {
    return this.productService.allProducts().filter(p => 
      p.category === 'carvao-acendedores' || 
      p.category === 'sais-temperos' || 
      p.category === 'acessorios'
    );
  });

  readonly drinksProducts = computed(() => {
    return this.productService.allProducts().filter(p => p.category === 'bebidas');
  });

  // Quantidade temporária para cada produto no grid
  productQuantities = signal<Record<string, number>>({});

  ngOnInit() {
    // Inicializar quantidades padrão para cada produto
    const initial: Record<string, number> = {};
    for (const prod of this.productService.allProducts()) {
      initial[prod.id] = prod.minUnit || (prod.unit === 'kg' ? 1.0 : 1);
    }
    this.productQuantities.set(initial);
  }

  getQty(productId: string): number {
    return this.productQuantities()[productId] || 1;
  }

  incrementGridQty(product: Product) {
    const step = product.unitStep || (product.unit === 'kg' ? 0.5 : 1);
    const max = product.maxUnit || 20;
    const curr = this.getQty(product.id);
    const nextVal = Math.min(max, Math.round((curr + step) * 10) / 10);
    this.productQuantities.update(q => ({ ...q, [product.id]: nextVal }));

    // Se já estiver no kit, atualiza no kit também
    if (this.kitBuilder.isProductSelected(product.id)) {
      this.kitBuilder.updateQuantity(product.id, nextVal);
    }
  }

  decrementGridQty(product: Product) {
    const step = product.unitStep || (product.unit === 'kg' ? 0.5 : 1);
    const min = product.minUnit || (product.unit === 'kg' ? 0.5 : 1);
    const curr = this.getQty(product.id);
    const nextVal = Math.max(min, Math.round((curr - step) * 10) / 10);
    this.productQuantities.update(q => ({ ...q, [product.id]: nextVal }));

    // Se já estiver no kit, atualiza no kit também
    if (this.kitBuilder.isProductSelected(product.id)) {
      this.kitBuilder.updateQuantity(product.id, nextVal);
    }
  }

  toggleProductInKit(product: Product) {
    if (this.kitBuilder.isProductSelected(product.id)) {
      this.kitBuilder.removeProduct(product.id);
      this.toast.info(`${product.name} removido do kit.`);
    } else {
      const qty = this.getQty(product.id);
      this.kitBuilder.addProduct(product, qty);
      this.toast.success(`${product.name} adicionado ao kit!`);
    }
  }

  removeItemFromSummary(productId: string) {
    this.kitBuilder.removeProduct(productId);
  }

  updateKitItemQty(productId: string, newQty: number) {
    this.kitBuilder.updateQuantity(productId, newQty);
  }

  finishKitAndAddToCart() {
    const validation = this.kitBuilder.validation();
    if (!validation.isValid) {
      this.toast.error(
        `Regra obrigatória: você precisa escolher pelo menos ${this.minRequired} produtos distintos para montar um kit. Faltam ${validation.remainingCount}.`
      );
      return;
    }

    const kit = this.kitBuilder.buildCustomKit();
    if (kit) {
      this.cartService.addCustomKit(kit);
      this.toast.success('Seu Kit Personalizado com 5% de desconto foi adicionado ao carrinho!', 'Kit Adicionado');
      this.kitBuilder.clearKit();
    }
  }

  finishKitAndGoToCheckout() {
    const validation = this.kitBuilder.validation();
    if (!validation.isValid) {
      this.toast.error(
        `Regra obrigatória: selecione pelo menos ${this.minRequired} produtos distintos.`
      );
      return;
    }

    const kit = this.kitBuilder.buildCustomKit();
    if (kit) {
      this.cartService.addCustomKit(kit);
      this.kitBuilder.clearKit();
      this.router.navigate(['/checkout']);
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80';
    }
  }
}
