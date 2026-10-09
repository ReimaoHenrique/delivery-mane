import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { CurrencyBrlPipe } from '../../shared/pipes/currency-brl.pipe';
import { UnitFormatPipe } from '../../shared/pipes/unit-format.pipe';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyBrlPipe, UnitFormatPipe],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent {
  readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(NotificationService);

  order = signal<Order | undefined>(undefined);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        const found = this.orderService.getOrderById(id);
        if (found) {
          this.order.set(found);
          this.orderService.activeOrderId.set(found.id);
        }
      } else {
        const active = this.orderService.activeOrder();
        this.order.set(active);
      }
    });
  }

  advanceSimulation() {
    const o = this.order();
    if (!o) return;
    const next = this.orderService.advanceNextStatus(o.id);
    if (next) {
      this.order.set(this.orderService.getOrderById(o.id));
      this.toast.success(`Status atualizado para: ${this.order()?.statusLabel}`, 'Acompanhamento');
    } else {
      this.toast.info('O pedido já atingiu o estado final (Concluído).');
    }
  }

  isStepCompleted(status: OrderStatus): boolean {
    const o = this.order();
    if (!o) return false;
    const sequence: OrderStatus[] = ['received', 'confirmed', 'preparing', 'ready_or_out', 'completed'];
    const currentIdx = sequence.indexOf(o.status);
    const stepIdx = sequence.indexOf(status);
    return stepIdx <= currentIdx;
  }

  isStepActive(status: OrderStatus): boolean {
    return this.order()?.status === status;
  }
}
