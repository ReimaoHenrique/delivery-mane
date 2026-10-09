import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { StoreService } from '../../core/services/store.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product, ProductCategory, ProductUnit } from '../../core/models/product.model';
import { Order, OrderStatus } from '../../core/models/order.model';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';
import { UnitFormatPipe } from '../../shared/pipes/unit-format.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyBrlPipe],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  readonly productService = inject(ProductService);
  readonly orderService = inject(OrderService);
  readonly storeService = inject(StoreService);
  private readonly toast = inject(NotificationService);

  activeTab = signal<'products' | 'orders' | 'inventory'>('products');

  // Modal Novo/Editar Produto
  isProductModalOpen = signal<boolean>(false);
  editingProduct = signal<Product | null>(null);

  productForm = signal<Omit<Product, 'id'>>({
    name: '',
    category: 'bovinos',
    meatType: 'bovino',
    cutType: 'Picanha',
    description: '',
    price: 89.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 20,
    featured: false,
    details: {
      temperature: 'Resfriado (Cru)',
      variableWeightAlert: true
    }
  });

  openNewProductModal() {
    this.editingProduct.set(null);
    this.productForm.set({
      name: '',
      category: 'bovinos',
      meatType: 'bovino',
      cutType: '',
      description: '',
      price: 59.90,
      unit: 'kg',
      unitStep: 0.5,
      minUnit: 0.5,
      maxUnit: 10,
      imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      stockQuantity: 20,
      featured: false,
      details: {
        temperature: 'Resfriado (Cru)',
        variableWeightAlert: true
      }
    });
    this.isProductModalOpen.set(true);
  }

  editProduct(prod: Product) {
    this.editingProduct.set(prod);
    this.productForm.set({
      name: prod.name,
      category: prod.category,
      meatType: prod.meatType || 'bovino',
      cutType: prod.cutType || '',
      description: prod.description,
      price: prod.price,
      unit: prod.unit,
      unitStep: prod.unitStep || 0.5,
      minUnit: prod.minUnit || 0.5,
      maxUnit: prod.maxUnit || 10,
      imageUrl: prod.imageUrl,
      inStock: prod.inStock,
      stockQuantity: prod.stockQuantity,
      featured: prod.featured || false,
      details: {
        temperature: prod.details?.temperature || 'Resfriado (Cru)',
        variableWeightAlert: prod.details?.variableWeightAlert || false
      }
    });
    this.isProductModalOpen.set(true);
  }

  saveProduct() {
    const data = this.productForm();
    if (!data.name || data.price <= 0) {
      this.toast.error('Informe o nome e o preço do corte/produto.');
      return;
    }

    const edit = this.editingProduct();
    if (edit) {
      this.productService.updateProduct({ ...data, id: edit.id });
      this.toast.success('Produto atualizado com sucesso!', 'Açougue Admin');
    } else {
      this.productService.addProduct(data);
      this.toast.success('Novo corte cadastrado no catálogo!', 'Açougue Admin');
    }

    this.isProductModalOpen.set(false);
  }

  deleteProduct(id: string) {
    if (confirm('Tem certeza que deseja remover este produto do catálogo?')) {
      this.productService.deleteProduct(id);
      this.toast.info('Produto removido.');
    }
  }

  updateOrderStatus(orderId: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as OrderStatus;
    this.orderService.updateOrderStatus(orderId, newStatus);
    this.toast.success(`Status do pedido atualizado para: ${newStatus}`);
  }

  resetAllData() {
    if (confirm('Deseja restaurar todos os produtos e estoques para os valores padrão de fábrica?')) {
      this.productService.resetToDefaults();
      this.toast.success('Dados restaurados com sucesso!');
    }
  }
}
