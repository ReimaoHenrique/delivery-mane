import { Injectable, signal } from '@angular/core';
import { Store } from '../models/store.model';
import { MOCK_STORES } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  readonly stores = signal<Store[]>(MOCK_STORES);

  getStoreById(id: string): Store | undefined {
    return this.stores().find(s => s.id === id);
  }

  getDefaultStore(): Store {
    return this.stores()[0];
  }
}
