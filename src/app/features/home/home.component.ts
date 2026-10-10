import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { KitBuilderService } from '../../core/services/kit-builder.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly kitBuilder = inject(KitBuilderService);
  private readonly toast = inject(NotificationService);

  // BBQ Calculator Signals
  calcAdults = signal<number>(6);
  calcChildren = signal<number>(2);
  calcDrinkers = signal<number>(4);

  // Daily cuts for everyday grilling
  readonly dailyCutIds = ['bov-03', 'bov-05', 'bov-06', 'sui-02'] as const;
  readonly dailyCuts = computed(() => 
    this.dailyCutIds
      .map(id => this.productService.getProductById(id))
      .filter((p): p is Product => p !== undefined)
  );

  // BBQ Calculator Calculations
  readonly calculatedMeatKg = computed(() => {
    // 400g por adulto, 200g por criança
    const total = (this.calcAdults() * 0.4) + (this.calcChildren() * 0.2);
    return Math.round(total * 10) / 10;
  });

  readonly calculatedCharcoalKg = computed(() => {
    // Aprox 1kg de carvão para cada 1kg de carne + margem de 1kg
    const meat = this.calculatedMeatKg();
    return Math.max(3, Math.ceil(meat * 1.1));
  });

  readonly calculatedBeerUnits = computed(() => {
    // 4 latas/garrafas por pessoa que bebe
    return this.calcDrinkers() * 4;
  });

  addSuggestedKit() {
    // Adiciona uma sugestão rápida de carnes para o montador de kits
    const picanha = this.productService.getProductById('bov-01');
    const linguiça = this.productService.getProductById('ling-01');
    const carvao = this.productService.getProductById('carv-01');

    if (picanha && linguiça && carvao) {
      this.kitBuilder.clearKit();
      this.kitBuilder.addProduct(picanha, 1.5);
      this.kitBuilder.addProduct(linguiça, 1.0);
      this.kitBuilder.addProduct(carvao, 1);
      this.toast.success('Sugestão de carnes carregada no Montador de Kits!', 'Kit Pronto');
    }
  }
}
