import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderStatus, OrderTimelineEvent } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { Address, DeliveryOption, FulfillmentType } from '../models/address.model';
import { Store } from '../models/store.model';
import { PaymentInfo } from '../models/order.model';

const ORDERS_STORAGE_KEY = 'delivery_mane_orders_v1';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Pedido Recebido',
  confirmed: 'Confirmado pelo Açougue',
  preparing: 'Em Separação e Corte',
  ready_or_out: 'Saiu para Entrega / Pronto para Retirada',
  completed: 'Pedido Entregue e Concluído',
  cancelled: 'Pedido Cancelado'
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  readonly orders = signal<Order[]>(this.loadOrdersFromStorage());
  readonly activeOrderId = signal<string | null>(null);

  readonly activeOrder = computed<Order | undefined>(() => {
    const id = this.activeOrderId();
    if (!id) return this.orders()[0];
    return this.orders().find(o => o.id === id);
  });

  private loadOrdersFromStorage(): Order[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  }

  private saveOrders(orders: Order[]) {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }

  createOrder(params: {
    customer: { name: string; email: string; phone: string; cpf: string };
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
  }): Order {
    const orderNumber = 'MANE-' + Math.floor(100000 + Math.random() * 900000);
    const id = 'ord-' + Date.now();
    const now = new Date();

    const timeline: OrderTimelineEvent[] = [
      {
        status: 'received',
        title: 'Pedido Recebido',
        description: 'Recebemos o seu pedido de churrasco no sistema.',
        timestamp: now,
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Pedido Confirmado',
        description: 'Açougueiro confirmou a disponibilidade dos cortes selecionados.',
        timestamp: new Date(now.getTime() + 2 * 60000),
        completed: true
      },
      {
        status: 'preparing',
        title: 'Em Separação e Corte',
        description: 'Cortes sendo pesados, porcionados e embalados a vácuo com gelo térmico.',
        timestamp: new Date(now.getTime() + 10 * 60000),
        completed: false
      },
      {
        status: 'ready_or_out',
        title: params.fulfillmentType === 'delivery' ? 'Saiu para Entrega' : 'Pronto para Retirada',
        description: params.fulfillmentType === 'delivery'
          ? 'O entregador Mané retirou a embalagem térmica e está a caminho.'
          : `Disponível no balcão da ${params.pickupStore?.tradeName || 'loja'}.`,
        timestamp: new Date(now.getTime() + 30 * 60000),
        completed: false
      },
      {
        status: 'completed',
        title: 'Pedido Concluído',
        description: 'Churrasco garantido! Bom apetite!',
        timestamp: new Date(now.getTime() + 50 * 60000),
        completed: false
      }
    ];

    const estimatedTime = params.fulfillmentType === 'delivery' 
      ? params.deliveryOption?.estimatedTime || '45 a 60 minutos'
      : `${params.pickupDate || 'Hoje'} (${params.pickupTimeSlot || 'Horário comercial'})`;

    const newOrder: Order = {
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      status: 'confirmed',
      statusLabel: ORDER_STATUS_LABELS['confirmed'],
      customer: params.customer,
      fulfillmentType: params.fulfillmentType,
      deliveryAddress: params.deliveryAddress,
      deliveryOption: params.deliveryOption,
      pickupStore: params.pickupStore,
      pickupDate: params.pickupDate,
      pickupTimeSlot: params.pickupTimeSlot,
      items: [...params.items],
      subtotal: params.subtotal,
      discount: params.discount,
      deliveryFee: params.deliveryFee,
      total: params.total,
      payment: params.payment,
      notes: params.notes,
      timeline,
      estimatedDeliveryOrPickupTime: estimatedTime
    };

    const updated = [newOrder, ...this.orders()];
    this.orders.set(updated);
    this.saveOrders(updated);
    this.activeOrderId.set(newOrder.id);
    return newOrder;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders().find(o => o.id === id || o.orderNumber === id);
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const updated = this.orders().map(o => {
      if (o.id === orderId) {
        const timeline = o.timeline.map(step => {
          if (step.status === newStatus) {
            return { ...step, completed: true, timestamp: new Date() };
          }
          return step;
        });

        return {
          ...o,
          status: newStatus,
          statusLabel: ORDER_STATUS_LABELS[newStatus],
          updatedAt: new Date(),
          timeline
        };
      }
      return o;
    });

    this.orders.set(updated);
    this.saveOrders(updated);
  }

  // Avançar estado para simulação de acompanhamento do pedido
  advanceNextStatus(orderId: string): OrderStatus | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const sequence: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready_or_out', 'completed'];
    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex > -1 && currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      this.updateOrderStatus(orderId, nextStatus);
      return nextStatus;
    }
    return null;
  }
}
