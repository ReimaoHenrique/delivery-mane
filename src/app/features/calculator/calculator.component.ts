import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';
import { Product } from '../../core/models/product.model';

export interface MeatOption {
  id: string;
  name: string;
  category: 'bovino' | 'suino' | 'frango' | 'linguica' | 'acompanhamento';
  icon: string;
  defaultShare: number; // Porcentagem do total de carne
  selected: boolean;
  productId?: string;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyBrlPipe],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly toast = inject(NotificationService);
  private readonly router = inject(Router);

  // Convidados
  readonly men = signal<number>(6);
  readonly women = signal<number>(4);
  readonly children = signal<number>(2);
  readonly vegetarians = signal<number>(0);

  // Perfil do Churrasco
  readonly duration = signal<'short' | 'standard' | 'long'>('standard'); // 2-3h, 4-6h, +6h
  readonly appetite = signal<'moderate' | 'normal' | 'heavy'>('normal'); // apetite da galera
  readonly includeBeer = signal<boolean>(true);
  readonly beerDrinkers = signal<number>(7);
  readonly includeSoda = signal<boolean>(true);
  readonly includeIce = signal<boolean>(true);
  readonly includeCharcoal = signal<boolean>(true);
  readonly includeGarlicBread = signal<boolean>(true);
  readonly includeCheese = signal<boolean>(true);

  // Opções de Cortes Selecionados
  readonly meatOptions = signal<MeatOption[]>([
    { id: 'picanha', name: 'Picanha Nobre Bovina', category: 'bovino', icon: '🥩', defaultShare: 0.35, selected: true, productId: 'prod-1' },
    { id: 'fraldinha', name: 'Fraldinha na Mostarda / Grill', category: 'bovino', icon: '🥩', defaultShare: 0.25, selected: true, productId: 'prod-2' },
    { id: 'costela', name: 'Costela de Tiras Bovina', category: 'bovino', icon: '🍖', defaultShare: 0.20, selected: false, productId: 'prod-3' },
    { id: 'linguica', name: 'Linguiça Toscana Artesanal', category: 'linguica', icon: '🌭', defaultShare: 0.20, selected: true, productId: 'prod-7' },
    { id: 'frango', name: 'Meio da Asa / Coxinha', category: 'frango', icon: '🍗', defaultShare: 0.15, selected: true, productId: 'prod-9' },
    { id: 'panceta', name: 'Panceta Suína Crocante', category: 'suino', icon: '🥓', defaultShare: 0.15, selected: false, productId: 'prod-8' },
  ]);

  // Cálculos Computados
  readonly totalAdults = computed(() => this.men() + this.women() + this.vegetarians());
  readonly totalGuests = computed(() => this.totalAdults() + this.children());
  readonly meatEaters = computed(() => this.men() + this.women() + (this.children() * 0.5));

  readonly durationFactor = computed(() => {
    switch (this.duration()) {
      case 'short': return 0.85;
      case 'long': return 1.25;
      default: return 1.0;
    }
  });

  readonly appetiteFactor = computed(() => {
    switch (this.appetite()) {
      case 'moderate': return 0.85;
      case 'heavy': return 1.20;
      default: return 1.0;
    }
  });

  // Total de Carne Crua (kg)
  readonly totalMeatKg = computed(() => {
    const baseGramsMen = 450;
    const baseGramsWomen = 320;
    const baseGramsChildren = 180;

    const rawGrams = (this.men() * baseGramsMen) + (this.women() * baseGramsWomen) + (this.children() * baseGramsChildren);
    const total = (rawGrams / 1000) * this.durationFactor() * this.appetiteFactor();
    return Math.max(1, Math.round(total * 10) / 10);
  });

  // Divisão por Corte Selecionado
  readonly meatBreakdown = computed(() => {
    const total = this.totalMeatKg();
    const selected = this.meatOptions().filter(m => m.selected);
    if (selected.length === 0) return [];

    const totalWeight = selected.reduce((sum, item) => sum + item.defaultShare, 0);
    return selected.map(item => {
      const share = item.defaultShare / totalWeight;
      const kg = Math.round((total * share) * 10) / 10;
      return {
        ...item,
        kg: Math.max(0.5, kg),
        estimatedCost: kg * (item.category === 'bovino' ? 69.90 : item.category === 'linguica' ? 27.90 : 22.90)
      };
    });
  });

  // Carvão & Acendedores
  readonly charcoalKg = computed(() => {
    if (!this.includeCharcoal()) return 0;
    const kgMeat = this.totalMeatKg();
    const base = Math.ceil(kgMeat * 0.9);
    // Vende em sacos de 4kg
    return Math.max(4, Math.ceil(base / 4) * 4);
  });

  readonly firestarterUnits = computed(() => {
    return this.includeCharcoal() ? Math.max(1, Math.ceil(this.charcoalKg() / 8)) : 0;
  });

  // Bebidas
  readonly beerUnits = computed(() => {
    if (!this.includeBeer()) return 0;
    const drinkers = Math.min(this.beerDrinkers(), this.totalAdults());
    const cansPerPerson = this.duration() === 'short' ? 4 : this.duration() === 'long' ? 8 : 6;
    return drinkers * cansPerPerson;
  });

  readonly sodaLiters = computed(() => {
    if (!this.includeSoda()) return 0;
    const nonBeerAdults = Math.max(0, this.totalAdults() - (this.includeBeer() ? this.beerDrinkers() : 0));
    const people = nonBeerAdults + this.children() + (this.vegetarians() * 1);
    const liters = (people * 0.6) * this.durationFactor();
    return Math.max(2, Math.ceil(liters));
  });

  readonly iceBags = computed(() => {
    if (!this.includeIce()) return 0;
    const guests = this.totalGuests();
    return Math.max(1, Math.ceil(guests / 8));
  });

  // Acompanhamentos
  readonly garlicBreadPacks = computed(() => {
    if (!this.includeGarlicBread()) return 0;
    const guests = this.totalGuests();
    return Math.max(1, Math.ceil(guests / 4));
  });

  readonly cheesePacks = computed(() => {
    if (!this.includeCheese()) return 0;
    const guests = this.totalGuests();
    return Math.max(1, Math.ceil(guests / 5));
  });

  // Estimativa Financeira
  readonly estimatedTotal = computed(() => {
    let sum = 0;
    // Carnes
    this.meatBreakdown().forEach(m => sum += m.estimatedCost);
    // Carvão (~R$ 24 por saco 4kg)
    if (this.includeCharcoal()) sum += (this.charcoalKg() / 4) * 23.90;
    // Acendedor (~R$ 8.90)
    if (this.includeCharcoal()) sum += this.firestarterUnits() * 8.90;
    // Cerveja (~R$ 5.50 a lata)
    if (this.includeBeer()) sum += this.beerUnits() * 5.50;
    // Refri (~R$ 9.90 por 2L)
    if (this.includeSoda()) sum += Math.ceil(this.sodaLiters() / 2) * 9.90;
    // Gelo (~R$ 12 por saco)
    if (this.includeIce()) sum += this.iceBags() * 12.00;
    // Pão de alho (~R$ 15.90 pacote)
    if (this.includeGarlicBread()) sum += this.garlicBreadPacks() * 15.90;
    // Queijo coalho (~R$ 18.90 pacote)
    if (this.includeCheese()) sum += this.cheesePacks() * 18.90;

    return Math.round(sum * 100) / 100;
  });

  readonly costPerPerson = computed(() => {
    const guests = this.totalGuests();
    if (guests === 0) return 0;
    return Math.round((this.estimatedTotal() / guests) * 100) / 100;
  });

  toggleMeat(id: string) {
    this.meatOptions.update(options => {
      const selectedCount = options.filter(o => o.selected).length;
      return options.map(opt => {
        if (opt.id === id) {
          // Não permite desmarcar todos
          if (opt.selected && selectedCount <= 1) {
            this.toast.warning('Selecione pelo menos 1 corte de carne para o cálculo.', 'Calculadora');
            return opt;
          }
          return { ...opt, selected: !opt.selected };
        }
        return opt;
      });
    });
  }

  addAllToCart() {
    let addedCount = 0;
    const allProds = this.productService.allProducts();

    // 1. Carnes
    this.meatBreakdown().forEach(item => {
      if (item.productId) {
        const prod = allProds.find(p => p.id === item.productId);
        if (prod) {
          this.cartService.addProduct(prod, Math.max(1, Math.round(item.kg)));
          addedCount++;
        }
      }
    });

    // 2. Carvão (prod-10)
    if (this.includeCharcoal()) {
      const charcoal = allProds.find(p => p.id === 'prod-10' || p.category === 'carvao-acendedores');
      if (charcoal) {
        this.cartService.addProduct(charcoal, Math.max(1, Math.ceil(this.charcoalKg() / 4)));
        addedCount++;
      }
    }

    // 3. Pão de Alho (prod-15)
    if (this.includeGarlicBread()) {
      const garlic = allProds.find(p => p.id === 'prod-15');
      if (garlic) {
        this.cartService.addProduct(garlic, this.garlicBreadPacks());
        addedCount++;
      }
    }

    // 4. Queijo Coalho (prod-16)
    if (this.includeCheese()) {
      const cheese = allProds.find(p => p.id === 'prod-16');
      if (cheese) {
        this.cartService.addProduct(cheese, this.cheesePacks());
        addedCount++;
      }
    }

    // 5. Cerveja (prod-13)
    if (this.includeBeer() && this.beerUnits() > 0) {
      const beer = allProds.find(p => p.id === 'prod-13');
      if (beer) {
        this.cartService.addProduct(beer, Math.min(24, Math.max(1, Math.ceil(this.beerUnits() / 6))));
        addedCount++;
      }
    }

    this.toast.success(`${addedCount} produtos da lista calculada foram adicionados ao carrinho!`, 'Churrasco Garantido');
    this.cartService.openDrawer();
  }

  copyWhatsAppList() {
    const text = `🥩 *LISTA DE CHURRASCO — DELIVERY MANÉ* 🔥
👥 *Convidados:* ${this.totalGuests()} pessoas (${this.men()} homens, ${this.women()} mulheres, ${this.children()} crianças)
⏱ *Duração:* ${this.duration() === 'short' ? '2 a 3h' : this.duration() === 'long' ? '+6h' : '4 a 6h'}

🥓 *CARNES CRUAS RECOMENDADAS (${this.totalMeatKg()} kg total):*
${this.meatBreakdown().map(m => ` • ${m.name}: ${m.kg} kg`).join('\n')}

🔥 *CHURRASQUEIRA & CARVÃO:*
 • Carvão Vegetal: ${this.charcoalKg()} kg
 • Acendedor: ${this.firestarterUnits()} un

🍺 *BEBIDAS & GELO:*
${this.includeBeer() ? ` • Cerveja: ${this.beerUnits()} latas` : ''}
${this.includeSoda() ? ` • Refrigerante/Sucos: ${this.sodaLiters()} L` : ''}
${this.includeIce() ? ` • Gelo: ${this.iceBags()} sacos` : ''}

🥖 *ACOMPANHAMENTOS:*
${this.includeGarlicBread() ? ` • Pão de Alho: ${this.garlicBreadPacks()} pct` : ''}
${this.includeCheese() ? ` • Queijo Coalho: ${this.cheesePacks()} pct` : ''}

💰 *Estimativa Total:* R$ ${this.estimatedTotal().toFixed(2)} (R$ ${this.costPerPerson().toFixed(2)} / pessoa)
_Peça direto no app Delivery Mané!_`;

    navigator.clipboard.writeText(text).then(() => {
      this.toast.success('Lista copiada com sucesso! Cole no grupo do WhatsApp.', 'WhatsApp');
    }).catch(() => {
      this.toast.info('Não foi possível copiar automaticamente.', 'Aviso');
    });
  }
}
