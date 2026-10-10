import { Injectable, signal, computed } from '@angular/core';
import { Product, CategoryInfo, ProductCategory, MeatType } from '../models/product.model';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mock-data';

const PRODUCTS_STORAGE_KEY = 'delivery_mane_products_v3';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>(this.loadInitialProducts());
  readonly categories = signal<CategoryInfo[]>(MOCK_CATEGORIES);

  readonly allProducts = this.productsSignal.asReadonly();

  readonly featuredProducts = computed(() => {
    return this.productsSignal().filter(p => p.featured && p.inStock);
  });

  readonly promotions = computed(() => {
    return this.productsSignal().filter(p => !!p.promotion && p.inStock);
  });

  private loadInitialProducts(): Product[] {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return MOCK_PRODUCTS;
  }

  private saveProducts(products: Product[]) {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    if (category === 'kits') {
      return this.productsSignal();
    }
    return this.productsSignal().filter(p => p.category === category);
  }

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find(p => p.id === id);
  }

  searchProducts(query: string, options?: {
    category?: ProductCategory;
    meatType?: MeatType;
    inStockOnly?: boolean;
    maxPrice?: number;
  }): Product[] {
    let list = this.productsSignal();

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.cutType && p.cutType.toLowerCase().includes(q))
      );
    }

    if (options?.category && options.category !== 'kits') {
      list = list.filter(p => p.category === options.category);
    }

    if (options?.meatType) {
      list = list.filter(p => p.meatType === options.meatType);
    }

    if (options?.inStockOnly) {
      list = list.filter(p => p.inStock);
    }

    if (options?.maxPrice && options.maxPrice > 0) {
      list = list.filter(p => p.price <= options.maxPrice!);
    }

    return list;
  }

  // --- ADMIN ACTIONS ---
  addProduct(product: Omit<Product, 'id'>): Product {
    const id = 'prod-' + Date.now();
    const newProd: Product = { ...product, id };
    const updated = [newProd, ...this.productsSignal()];
    this.productsSignal.set(updated);
    this.saveProducts(updated);
    return newProd;
  }

  updateProduct(product: Product) {
    const updated = this.productsSignal().map(p => p.id === product.id ? product : p);
    this.productsSignal.set(updated);
    this.saveProducts(updated);
  }

  deleteProduct(id: string) {
    const updated = this.productsSignal().filter(p => p.id !== id);
    this.productsSignal.set(updated);
    this.saveProducts(updated);
  }

  updateStock(id: string, newStock: number, inStock: boolean) {
    const updated = this.productsSignal().map(p => {
      if (p.id === id) {
        return { ...p, stockQuantity: newStock, inStock };
      }
      return p;
    });
    this.productsSignal.set(updated);
    this.saveProducts(updated);
  }

  resetToDefaults() {
    this.productsSignal.set(MOCK_PRODUCTS);
    this.saveProducts(MOCK_PRODUCTS);
  }
}
