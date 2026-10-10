import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CurrencyBrlPipe } from '../../pipes/currency-brl.pipe';
import { UnitFormatPipe } from '../../pipes/unit-format.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyBrlPipe, UnitFormatPipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() compact: boolean = false;

  private readonly cartService = inject(CartService);
  private readonly toast = inject(NotificationService);

  quantity = signal<number>(1);

  ngOnInit() {
    if (this.product) {
      this.quantity.set(this.product.minUnit || (this.product.unit === 'kg' ? 1.0 : 1));
    }
  }

  increment() {
    const step = this.product.unitStep || (this.product.unit === 'kg' ? 0.5 : 1);
    const max = this.product.maxUnit || 20;
    this.quantity.update(q => Math.min(max, Math.round((q + step) * 10) / 10));
  }

  decrement() {
    const step = this.product.unitStep || (this.product.unit === 'kg' ? 0.5 : 1);
    const min = this.product.minUnit || (this.product.unit === 'kg' ? 0.5 : 1);
    this.quantity.update(q => Math.max(min, Math.round((q - step) * 10) / 10));
  }

  addToCart() {
    if (!this.product.inStock) {
      this.toast.error('Este produto está temporariamente esgotado.');
      return;
    }

    const qty = this.quantity();
    this.cartService.addProduct(this.product, qty);
    
    const formattedQty = this.product.unit === 'kg' 
      ? `${qty.toFixed(1).replace('.', ',')} kg` 
      : `${qty} ${this.product.unit}`;

    this.toast.success(`${formattedQty} de ${this.product.name} adicionado ao carrinho!`, 'Adicionado');
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80';
    }
  }
}
