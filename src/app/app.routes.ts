import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { KitBuilderComponent } from './features/kit-builder/kit-builder.component';
import { CalculatorComponent } from './features/calculator/calculator.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderTrackingComponent } from './features/order-tracking/order-tracking.component';
import { AccountComponent } from './features/account/account.component';
import { AdminComponent } from './features/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Delivery Mané — Seu churrasco começa aqui!'
  },
  {
    path: 'montar-kit',
    component: KitBuilderComponent,
    title: 'Montar Kit de Churrasco — Delivery Mané'
  },
  {
    path: 'calculadora',
    component: CalculatorComponent,
    title: 'Calculadora de Churrasco — Delivery Mané'
  },
  {
    path: 'catalogo',
    component: CatalogComponent,
    title: 'Catálogo de Carnes & Churrasco — Delivery Mané'
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    title: 'Finalizar Pedido — Delivery Mané'
  },
  {
    path: 'acompanhar',
    component: OrderTrackingComponent,
    title: 'Acompanhar Pedido — Delivery Mané'
  },
  {
    path: 'acompanhar/:id',
    component: OrderTrackingComponent,
    title: 'Acompanhar Pedido — Delivery Mané'
  },
  {
    path: 'conta',
    component: AccountComponent,
    title: 'Minha Conta — Delivery Mané'
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Painel do Açougue — Delivery Mané'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
