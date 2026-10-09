import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (t of notificationService.toasts(); track t.id) {
        <div class="toast-item toast-{{ t.type }} animate-fade-in" (click)="dismiss(t.id)">
          <div class="toast-icon">
            @switch (t.type) {
              @case ('success') { ✅ }
              @case ('warning') { ⚠️ }
              @case ('error') { ❌ }
              @default { ℹ️ }
            }
          </div>
          <div class="toast-content">
            @if (t.title) {
              <strong class="toast-title">{{ t.title }}</strong>
            }
            <p class="toast-message">{{ t.message }}</p>
          </div>
          <button class="toast-close" (click)="dismiss(t.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      max-width: 380px;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1.15rem;
      border-radius: var(--radius-md);
      background-color: #ffffff;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: var(--transition);

      &:hover {
        transform: translateY(-2px);
      }

      &.toast-success {
        border-left: 4px solid var(--color-success);
      }

      &.toast-warning {
        border-left: 4px solid var(--color-warning);
      }

      &.toast-error {
        border-left: 4px solid var(--color-danger);
      }

      &.toast-info {
        border-left: 4px solid var(--color-primary);
      }

      .toast-icon {
        font-size: 1.15rem;
        line-height: 1;
      }

      .toast-content {
        flex: 1;

        .toast-title {
          font-size: 0.875rem;
          color: var(--text-main);
          display: block;
          margin-bottom: 0.15rem;
        }

        .toast-message {
          font-size: 0.825rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
      }

      .toast-close {
        color: var(--text-light);
        font-size: 0.8rem;
        padding: 0.2rem;
      }
    }
  `]
})
export class ToastComponent {
  readonly notificationService = inject(NotificationService);

  dismiss(id: string) {
    this.notificationService.dismiss(id);
  }
}
