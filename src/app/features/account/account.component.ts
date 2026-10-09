import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { AddressService } from '../../core/services/address.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Order } from '../../core/models/order.model';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyBrlPipe],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  readonly authService = inject(AuthService);
  readonly orderService = inject(OrderService);
  readonly addressService = inject(AddressService);
  readonly cartService = inject(CartService);
  private readonly toast = inject(NotificationService);
  private readonly router = inject(Router);

  activeTab = signal<'profile' | 'orders' | 'addresses'>('orders');

  // Edit profile state
  editName = signal<string>('');
  editEmail = signal<string>('');
  editPhone = signal<string>('');
  editCpf = signal<string>('');

  ngOnInit() {
    const cust = this.authService.currentCustomer();
    if (cust) {
      this.editName.set(cust.name);
      this.editEmail.set(cust.email);
      this.editPhone.set(cust.phone);
      this.editCpf.set(cust.cpf);
    }
  }

  saveProfile() {
    this.authService.updateProfile({
      name: this.editName(),
      email: this.editEmail(),
      phone: this.editPhone(),
      cpf: this.editCpf()
    });
    this.toast.success('Perfil atualizado com sucesso!', 'Conta');
  }

  repeatOrder(order: Order) {
    this.cartService.clearCart();
    for (const item of order.items) {
      if (item.type === 'single-product' && item.product) {
        this.cartService.addProduct(item.product, item.itemWeightOrUnit || 1);
      } else if (item.type === 'custom-kit' && item.customKit) {
        this.cartService.addCustomKit(item.customKit);
      }
    }
    this.toast.success(`Itens do pedido #${order.orderNumber} foram adicionados ao seu carrinho!`, 'Pedido Repetido');
    this.cartService.openDrawer();
  }

  trackOrder(order: Order) {
    this.orderService.activeOrderId.set(order.id);
    this.router.navigate(['/acompanhar', order.id]);
  }

  deleteAddress(id: string) {
    this.addressService.deleteAddress(id);
    this.toast.info('Endereço removido.');
  }

  toggleAdmin() {
    this.authService.toggleAdminMode();
    this.toast.info(
      this.authService.isAdminMode() ? 'Modo Administrador ativado!' : 'Modo Administrador desativado.'
    );
  }
}
