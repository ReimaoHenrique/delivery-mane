import { Injectable, signal } from '@angular/core';
import { Address, DeliveryOption, FulfillmentSelection, FulfillmentType } from '../models/address.model';
import { MOCK_DEFAULT_ADDRESSES, MOCK_DELIVERY_OPTIONS } from '../data/mock-data';

const ADDRESS_STORAGE_KEY = 'delivery_mane_addresses_v1';
const FULFILLMENT_STORAGE_KEY = 'delivery_mane_fulfillment_v1';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  readonly savedAddresses = signal<Address[]>(this.loadInitialAddresses());
  readonly deliveryOptions = signal<DeliveryOption[]>(MOCK_DELIVERY_OPTIONS);

  readonly fulfillment = signal<FulfillmentSelection>(this.loadInitialFulfillment());
  readonly isLocationModalOpen = signal<boolean>(false);

  private loadInitialAddresses(): Address[] {
    try {
      const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return MOCK_DEFAULT_ADDRESSES;
  }

  private loadInitialFulfillment(): FulfillmentSelection {
    try {
      const stored = localStorage.getItem(FULFILLMENT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    const defaultAddr = this.savedAddresses().find(a => a.isDefault) || this.savedAddresses()[0];
    const defaultOpt = this.deliveryOptions()[0];
    return {
      type: 'delivery',
      selectedAddress: defaultAddr,
      selectedDeliveryOption: defaultOpt,
      deliveryFee: defaultOpt?.fee ?? 14.90
    };
  }

  private saveAddresses(list: Address[]) {
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  private saveFulfillment(selection: FulfillmentSelection) {
    try {
      localStorage.setItem(FULFILLMENT_STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // ignore
    }
  }

  setFulfillmentType(type: FulfillmentType) {
    this.fulfillment.update(curr => {
      const updated: FulfillmentSelection = {
        ...curr,
        type,
        deliveryFee: type === 'pickup' ? 0 : (curr.selectedDeliveryOption?.fee ?? 14.90)
      };
      this.saveFulfillment(updated);
      return updated;
    });
  }

  selectAddress(address: Address) {
    this.fulfillment.update(curr => {
      const updated: FulfillmentSelection = {
        ...curr,
        type: 'delivery',
        selectedAddress: address,
        deliveryFee: curr.selectedDeliveryOption?.fee ?? 14.90
      };
      this.saveFulfillment(updated);
      return updated;
    });
  }

  selectDeliveryOption(option: DeliveryOption) {
    this.fulfillment.update(curr => {
      const updated: FulfillmentSelection = {
        ...curr,
        selectedDeliveryOption: option,
        deliveryFee: curr.type === 'pickup' ? 0 : option.fee
      };
      this.saveFulfillment(updated);
      return updated;
    });
  }

  selectPickupStore(storeId: string, pickupDate: string, timeSlot: string, instructions?: string) {
    this.fulfillment.update(curr => {
      const updated: FulfillmentSelection = {
        ...curr,
        type: 'pickup',
        selectedStoreId: storeId,
        pickupDate,
        pickupTimeSlot: timeSlot,
        pickupInstructions: instructions,
        deliveryFee: 0
      };
      this.saveFulfillment(updated);
      return updated;
    });
  }

  addAddress(address: Omit<Address, 'id'>): Address {
    const id = 'addr-' + Date.now();
    const newAddr: Address = { ...address, id };
    const updated = [newAddr, ...this.savedAddresses()];
    this.savedAddresses.set(updated);
    this.saveAddresses(updated);
    this.selectAddress(newAddr);
    return newAddr;
  }

  deleteAddress(id: string) {
    const updated = this.savedAddresses().filter(a => a.id !== id);
    this.savedAddresses.set(updated);
    this.saveAddresses(updated);
  }

  openLocationModal() {
    this.isLocationModalOpen.set(true);
  }

  closeLocationModal() {
    this.isLocationModalOpen.set(false);
  }

  // Lookup CEP simulado ou via API de consulta
  async lookupCep(cep: string): Promise<{ street: string; neighborhood: string; city: string; state: string } | null> {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (res.ok) {
        const data = await res.json();
        if (!data.erro) {
          return {
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          };
        }
      }
    } catch {
      // Fallback
    }

    // Default mock fallback para Florianópolis
    return {
      street: 'Rua do Churrasqueiro',
      neighborhood: 'Centro',
      city: 'Florianópolis',
      state: 'SC'
    };
  }
}
