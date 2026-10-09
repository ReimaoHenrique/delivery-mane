import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { AddressService } from '../../../core/services/address.service';
import { AuthService } from '../../../core/services/auth.service';
import { CurrencyBrlPipe } from '../../pipes/currency-brl.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, CurrencyBrlPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly cartService = inject(CartService);
  readonly addressService = inject(AddressService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  searchQuery = signal<string>('');
  isMobileMenuOpen = signal<boolean>(false);

  onSearchSubmit(event: Event) {
    event.preventDefault();
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/catalogo'], { queryParams: { q: query } });
      this.isMobileMenuOpen.set(false);
    }
  }

  openLocationModal() {
    this.addressService.openLocationModal();
  }

  toggleCart() {
    this.cartService.toggleDrawer();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
