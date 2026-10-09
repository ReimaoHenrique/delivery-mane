import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CurrencyBrlPipe } from '../../pipes/currency-brl.pipe';
import { UnitFormatPipe } from '../../pipes/unit-format.pipe';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyBrlPipe, UnitFormatPipe],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss']
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  private readonly toast = inject(NotificationService);
  private readonly router = inject(Router);

  couponInput = signal<string>('');

  close() {
    this.cartService.closeDrawer();
  }

  incrementSingleProduct(item: CartItem) {
    if (!item.product) return;
    const step = item.product.unitStep || (item.product.unit === 'kg' ? 0.5 : 1);
    const max = item.product.maxUnit || 20;
    const currentWeight = item.itemWeightOrUnit || 1;
    const nextVal = Math.min(max, Math.round((currentWeight + step) * 10) / 10);
    this.cartService.updateItemQuantity(item.id, nextVal);
  }

  decrementSingleProduct(item: CartItem) {
    if (!item.product) return;
    const step = item.product.unitStep || (item.product.unit === 'kg' ? 0.5 : 1);
    const min = item.product.minUnit || (item.product.unit === 'kg' ? 0.5 : 1);
    const currentWeight = item.itemWeightOrUnit || 1;
    const nextVal = Math.round((currentWeight - step) * 10) / 10;
    if (nextVal < min) {
      this.cartService.removeItem(item.id);
    } else {
      this.cartService.updateItemQuantity(item.id, nextVal);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.id);
    this.toast.info('Item removido do carrinho.');
  }

  applyCoupon() {
    const code = this.couponInput();
    if (!code) return;
    const result = this.cartService.applyCoupon(code);
    if (result.success) {
      this.toast.success(result.message);
      this.couponInput.set('');
    } else {
      this.toast.error(result.message);
    }
  }

  removeCoupon() {
    this.cartService.removeCoupon();
    this.toast.info('Cupom removido.');
  }

  goToCheckout() {
    this.cartService.closeDrawer();
    this.router.navigate(['/checkout']);
  }
}
