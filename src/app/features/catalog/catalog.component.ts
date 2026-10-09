import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ProductCategory, MeatType, Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent, CurrencyBrlPipe],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
  readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  selectedCategory = signal<ProductCategory | 'todas'>('todas');
  selectedMeatType = signal<MeatType | 'todos'>('todos');
  searchQuery = signal<string>('');
  inStockOnly = signal<boolean>(false);
  maxPriceFilter = signal<number>(150);
  onlyOffers = signal<boolean>(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.selectedCategory.set(params['categoria'] as ProductCategory);
      }
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
      if (params['ofertas'] === 'true') {
        this.onlyOffers.set(true);
      }
    });
  }

  readonly filteredProducts = computed<Product[]>(() => {
    let list = this.productService.allProducts();

    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.cutType && p.cutType.toLowerCase().includes(q))
      );
    }

    const cat = this.selectedCategory();
    if (cat !== 'todas') {
      list = list.filter(p => p.category === cat);
    }

    const meat = this.selectedMeatType();
    if (meat !== 'todos') {
      list = list.filter(p => p.meatType === meat);
    }

    if (this.inStockOnly()) {
      list = list.filter(p => p.inStock);
    }

    if (this.onlyOffers()) {
      list = list.filter(p => !!p.promotion);
    }

    list = list.filter(p => p.price <= this.maxPriceFilter());

    return list;
  });

  resetFilters() {
    this.selectedCategory.set('todas');
    this.selectedMeatType.set('todos');
    this.searchQuery.set('');
    this.inStockOnly.set(false);
    this.maxPriceFilter.set(150);
    this.onlyOffers.set(false);
  }
}
