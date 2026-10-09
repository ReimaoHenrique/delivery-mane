import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../core/services/address.service';
import { StoreService } from '../../../core/services/store.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Address, FulfillmentType } from '../../../core/models/address.model';
import { Store } from '../../../core/models/store.model';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent {
  readonly addressService = inject(AddressService);
  readonly storeService = inject(StoreService);
  private readonly toast = inject(NotificationService);

  activeTab = signal<FulfillmentType>('delivery');

  // Novo endereço formulário
  isAddingNewAddress = signal<boolean>(false);
  newAddress = signal<Omit<Address, 'id'>>({
    name: 'Endereço de Entrega',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'Florianópolis',
    state: 'SC',
    referencePoint: ''
  });
  isSearchingCep = signal<boolean>(false);

  // Retirada seleção
  selectedStore = signal<Store>(this.storeService.getDefaultStore());
  selectedPickupDay = signal<string>('Hoje');
  selectedTimeSlot = signal<string>('11:00 - 12:30');

  ngOnInit() {
    this.activeTab.set(this.addressService.fulfillment().type);
    const storeId = this.addressService.fulfillment().selectedStoreId;
    if (storeId) {
      const store = this.storeService.getStoreById(storeId);
      if (store) this.selectedStore.set(store);
    }
  }

  setTab(tab: FulfillmentType) {
    this.activeTab.set(tab);
    this.addressService.setFulfillmentType(tab);
  }

  close() {
    this.addressService.closeLocationModal();
  }

  selectAddress(address: Address) {
    this.addressService.selectAddress(address);
    this.toast.success(`Entregar em: ${address.neighborhood}, ${address.street}`, 'Endereço Selecionado');
    this.close();
  }

  async onCepBlur() {
    const cep = this.newAddress().zipCode;
    if (!cep || cep.replace(/\D/g, '').length < 8) return;

    this.isSearchingCep.set(true);
    const res = await this.addressService.lookupCep(cep);
    this.isSearchingCep.set(false);

    if (res) {
      this.newAddress.update(curr => ({
        ...curr,
        street: res.street,
        neighborhood: res.neighborhood,
        city: res.city,
        state: res.state
      }));
    }
  }

  saveNewAddress() {
    const a = this.newAddress();
    if (!a.street || !a.number || !a.neighborhood) {
      this.toast.error('Preencha a rua, número e bairro para entrega.');
      return;
    }

    const saved = this.addressService.addAddress(a);
    this.toast.success('Novo endereço cadastrado com sucesso!');
    this.isAddingNewAddress.set(false);
    this.selectAddress(saved);
  }

  confirmPickup() {
    const store = this.selectedStore();
    this.addressService.selectPickupStore(
      store.id,
      this.selectedPickupDay(),
      this.selectedTimeSlot(),
      store.pickupInstructions
    );
    this.toast.success(`Retirada agendada na ${store.tradeName} (${this.selectedPickupDay()} às ${this.selectedTimeSlot()})`, 'Retirada Confirmada');
    this.close();
  }
}
