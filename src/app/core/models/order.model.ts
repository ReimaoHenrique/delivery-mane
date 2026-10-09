import { CartItem } from './cart.model';
import { Address, FulfillmentType, DeliveryOption } from './address.model';
import { Store } from './store.model';

export type OrderStatus = 
  | 'received'       // Pedido recebido
  | 'confirmed'      // Pedido confirmado
  | 'preparing'      // Em separação / Corte no açougue
  | 'ready_or_out'   // Saiu para entrega ou Pronto para retirada
  | 'completed'      // Pedido concluído
  | 'cancelled';     // Pedido cancelado

export type PaymentMethod = 
  | 'pix' 
  | 'credit_card' 
  | 'debit_card' 
  | 'cash_on_delivery' 
  | 'card_on_delivery';

export interface PaymentInfo {
  method: PaymentMethod;
  methodLabel: string;
  pixQrCode?: string;
  pixCopiaECola?: string;
  cardLastDigits?: string;
  cardBrand?: string;
  installments?: number;
  cashChangeFor?: number; // Troco para quanto
  isPaid: boolean;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: Date;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  statusLabel: string;
  customer: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  fulfillmentType: FulfillmentType;
  deliveryAddress?: Address;
  deliveryOption?: DeliveryOption;
  pickupStore?: Store;
  pickupDate?: string;
  pickupTimeSlot?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  payment: PaymentInfo;
  notes?: string;
  timeline: OrderTimelineEvent[];
  estimatedDeliveryOrPickupTime: string;
}
