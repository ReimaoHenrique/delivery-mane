import { Injectable, signal } from '@angular/core';
import { Customer, UserSession } from '../models/customer.model';
import { MOCK_DEFAULT_ADDRESSES } from '../data/mock-data';

const AUTH_STORAGE_KEY = 'delivery_mane_auth_v1';

const DEFAULT_CUSTOMER: Customer = {
  id: 'cust-01',
  name: 'Henrique Churrasqueiro',
  email: 'henrique@deliverymane.com.br',
  phone: '(48) 99888-7766',
  cpf: '123.456.789-00',
  birthDate: '1990-05-15',
  addresses: MOCK_DEFAULT_ADDRESSES,
  favoriteKits: [],
  favoriteProductIds: ['bov-01', 'ling-01', 'carv-01'],
  createdAt: new Date('2024-01-10')
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentCustomer = signal<Customer | null>(this.loadInitialCustomer());
  readonly isAdminMode = signal<boolean>(false);

  readonly isAuthenticated = signal<boolean>(true);

  private loadInitialCustomer(): Customer | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEFAULT_CUSTOMER;
  }

  private saveCustomer(customer: Customer | null) {
    try {
      if (customer) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customer));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }

  login(email: string, _password?: string): boolean {
    const cust: Customer = {
      ...DEFAULT_CUSTOMER,
      email: email || DEFAULT_CUSTOMER.email,
      name: email.split('@')[0] || DEFAULT_CUSTOMER.name
    };
    this.currentCustomer.set(cust);
    this.isAuthenticated.set(true);
    this.saveCustomer(cust);
    return true;
  }

  register(customerData: Partial<Customer>): boolean {
    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: customerData.name || 'Novo Cliente Mané',
      email: customerData.email || 'cliente@deliverymane.com.br',
      phone: customerData.phone || '(48) 99999-0000',
      cpf: customerData.cpf || '000.000.000-00',
      addresses: MOCK_DEFAULT_ADDRESSES,
      favoriteKits: [],
      favoriteProductIds: [],
      createdAt: new Date()
    };
    this.currentCustomer.set(newCust);
    this.isAuthenticated.set(true);
    this.saveCustomer(newCust);
    return true;
  }

  updateProfile(profile: Partial<Customer>) {
    const current = this.currentCustomer();
    if (!current) return;
    const updated = { ...current, ...profile };
    this.currentCustomer.set(updated);
    this.saveCustomer(updated);
  }

  toggleAdminMode() {
    this.isAdminMode.update(v => !v);
  }

  logout() {
    this.currentCustomer.set(null);
    this.isAuthenticated.set(false);
    this.saveCustomer(null);
  }
}
