import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const duration = toast.durationMs ?? 4000;
    const newToast: ToastMessage = { ...toast, id };

    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  success(message: string, title: string = 'Sucesso') {
    this.show({ type: 'success', title, message });
  }

  info(message: string, title: string = 'Informação') {
    this.show({ type: 'info', title, message });
  }

  warning(message: string, title: string = 'Atenção') {
    this.show({ type: 'warning', title, message });
  }

  error(message: string, title: string = 'Erro') {
    this.show({ type: 'error', title, message });
  }

  dismiss(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
