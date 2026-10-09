import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/address.service';
import { StoreService } from '../../core/services/store.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { PaymentMethod, PaymentInfo } from '../../core/models/order.model';
import { FulfillmentType, Address, DeliveryOption } from '../../core/models/address.model';
import { Store } from '../../core/models/store.model';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';
import { UnitFormatPipe } from '../../shared/pipes/unit-format.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyBrlPipe, UnitFormatPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  readonly cartService = inject(CartService);
  readonly addressService = inject(AddressService);
  readonly storeService = inject(StoreService);
  readonly orderService = inject(OrderService);
  readonly authService = inject(AuthService);
  private readonly toast = inject(NotificationService);
  private readonly router = inject(Router);

  currentStep = signal<1 | 2 | 3 | 4 | 5>(1);

  // Customer Data
  customerName = signal<string>('Henrique Churrasqueiro');
  customerEmail = signal<string>('henrique@deliverymane.com.br');
  customerPhone = signal<string>('(48) 99888-7766');
  customerCpf = signal<string>('123.456.789-00');

  // Fulfillment Selection
  fulfillmentType = signal<FulfillmentType>('delivery');
  selectedAddress = signal<Address | undefined>(undefined);
  selectedDeliveryOption = signal<DeliveryOption | undefined>(undefined);
  selectedStore = signal<Store>(this.storeService.getDefaultStore());
  pickupDay = signal<string>('Hoje');
  pickupTime = signal<string>('11:00 - 12:30');

  // Payment Selection
  paymentMethod = signal<PaymentMethod>('pix');
  cashChangeFor = signal<number>(0);
  cardHolder = signal<string>('');
  cardNumber = signal<string>('');
  cardExpiry = signal<string>('');
  cardCvv = signal<string>('');
  installments = signal<number>(1);
  orderNotes = signal<string>('');

  isSubmitting = signal<boolean>(false);

  ngOnInit() {
    const cust = this.authService.currentCustomer();
    if (cust) {
      this.customerName.set(cust.name);
      this.customerEmail.set(cust.email);
      this.customerPhone.set(cust.phone);
      this.customerCpf.set(cust.cpf);
    }

    this.fulfillmentType.set(this.addressService.fulfillment().type);
    this.selectedAddress.set(this.addressService.fulfillment().selectedAddress || this.addressService.savedAddresses()[0]);
    this.selectedDeliveryOption.set(this.addressService.fulfillment().selectedDeliveryOption || this.addressService.deliveryOptions()[0]);
  }

  readonly deliveryFee = computed<number>(() => {
    if (this.fulfillmentType() === 'pickup' || this.cartService.isFreeDelivery()) {
      return 0;
    }
    return this.selectedDeliveryOption()?.fee ?? 14.90;
  });

  readonly finalOrderTotal = computed<number>(() => {
    return Math.round((this.cartService.total() + this.deliveryFee()) * 100) / 100;
  });

  setStep(step: 1 | 2 | 3 | 4 | 5) {
    this.currentStep.set(step);
  }

  nextStep() {
    const current = this.currentStep();
    if (current === 1 && this.cartService.itemsCount() === 0) {
      this.toast.error('Adicione produtos ao carrinho antes de continuar.');
      return;
    }
    if (current === 3) {
      if (!this.customerName() || !this.customerPhone() || !this.customerCpf()) {
        this.toast.error('Por favor, preencha os dados do cliente e CPF para emissão da nota.');
        return;
      }
    }
    if (current < 5) {
      this.currentStep.update(s => (s + 1) as any);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => (s - 1) as any);
    }
  }

  confirmOrder() {
    if (this.cartService.itemsCount() === 0) {
      this.toast.error('O carrinho está vazio.');
      return;
    }

    this.isSubmitting.set(true);

    const paymentInfo: PaymentInfo = {
      method: this.paymentMethod(),
      methodLabel: this.getPaymentLabel(this.paymentMethod()),
      pixQrCode: '00020126580014br.gov.bcb.pix0136mane-churrasco-delivery@pix.com.br5204000053039865802BR5920Delivery Mane Carnes6012Florianopolis62070503***6304ABCD',
      pixCopiaECola: '00020126580014br.gov.bcb.pix0136mane-churrasco-delivery@pix.com.br5204000053039865802BR5920Delivery Mane Carnes6012Florianopolis62070503***6304ABCD',
      cardLastDigits: this.cardNumber() ? this.cardNumber().slice(-4) : '4028',
      cardBrand: 'Mastercard',
      installments: this.installments(),
      cashChangeFor: this.cashChangeFor() > 0 ? this.cashChangeFor() : undefined,
      isPaid: this.paymentMethod() === 'pix' || this.paymentMethod() === 'credit_card'
    };

    setTimeout(() => {
      const order = this.orderService.createOrder({
        customer: {
          name: this.customerName(),
          email: this.customerEmail(),
          phone: this.customerPhone(),
          cpf: this.customerCpf()
        },
        fulfillmentType: this.fulfillmentType(),
        deliveryAddress: this.fulfillmentType() === 'delivery' ? this.selectedAddress() : undefined,
        deliveryOption: this.fulfillmentType() === 'delivery' ? this.selectedDeliveryOption() : undefined,
        pickupStore: this.fulfillmentType() === 'pickup' ? this.selectedStore() : undefined,
        pickupDate: this.fulfillmentType() === 'pickup' ? this.pickupDay() : undefined,
        pickupTimeSlot: this.fulfillmentType() === 'pickup' ? this.pickupTime() : undefined,
        items: [...this.cartService.items()],
        subtotal: this.cartService.subtotal(),
        discount: this.cartService.couponDiscount(),
        deliveryFee: this.deliveryFee(),
        total: this.finalOrderTotal(),
        payment: paymentInfo,
        notes: this.orderNotes()
      });

      this.cartService.clearCart();
      this.isSubmitting.set(false);
      this.toast.success(`Pedido #${order.orderNumber} confirmado com sucesso!`, 'Churrasco Garantido');
      this.router.navigate(['/acompanhar', order.id]);
    }, 1000);
  }

  private getPaymentLabel(method: PaymentMethod): string {
    switch (method) {
      case 'pix': return 'Pix Instantâneo (QR Code)';
      case 'credit_card': return 'Cartão de Crédito Online';
      case 'debit_card': return 'Cartão de Débito Online';
      case 'cash_on_delivery': return 'Dinheiro na Entrega / Retirada';
      case 'card_on_delivery': return 'Maquininha de Cartão na Entrega';
    }
  }
}
