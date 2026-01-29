import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toasts" 
           [ngClass]="{
             'bg-green-500': toast.type === 'success',
             'bg-red-500': toast.type === 'error',
             'bg-blue-500': toast.type === 'info',
             'bg-yellow-500': toast.type === 'warning'
           }"
           class="min-w-[300px] px-6 py-4 rounded-lg shadow-lg text-white font-medium 
                  animate-in slide-in-from-right duration-300 flex items-center justify-between">
        <span>{{ toast.message }}</span>
        <button (click)="removeToast(toast)" class="ml-4 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
    toasts: any[] = [];

    constructor(private toastService: ToastService) {
        this.toastService.toast$.subscribe(toast => {
            this.toasts.push(toast);
            setTimeout(() => {
                this.removeToast(toast);
            }, toast.duration || 3000);
        });
    }

    removeToast(toast: any) {
        const index = this.toasts.indexOf(toast);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }
    }
}
