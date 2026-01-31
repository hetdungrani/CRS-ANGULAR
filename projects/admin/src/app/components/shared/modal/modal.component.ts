import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalService.modal(); as modal) {
      <div 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        [@backdropAnimation]
      >
        <div 
          class="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-200 dark:border-gray-700"
          [@modalAnimation]
        >
          <!-- Header with color accent -->
          <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div [ngClass]="{
                'text-rose-600 bg-rose-50 dark:bg-rose-900/20': modal.type === 'danger',
                'text-amber-600 bg-amber-50 dark:bg-amber-900/20': modal.type === 'warning',
                'text-sky-600 bg-sky-50 dark:bg-sky-900/20': modal.type === 'info'
            }" class="p-2 rounded-full">
                @if(modal.type === 'danger') {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                } @else if(modal.type === 'warning') {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                } @else {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                }
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ modal.title }}</h3>
          </div>

          <!-- Body -->
          <div class="px-6 py-6">
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ modal.message }}</p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/40 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
            <button 
              (click)="modalService.close(false)"
              class="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              {{ modal.cancelText }}
            </button>
            <button 
              (click)="modalService.close(true)"
              class="px-5 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform active:scale-95"
              [ngClass]="{
                'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500': modal.type === 'danger',
                'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500': modal.type === 'warning',
                'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500': modal.type === 'info'
              }"
            >
              {{ modal.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  animations: [
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(10px)' }),
        animate('200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9) translateY(10px)' }))
      ])
    ])
  ]
})
export class ModalComponent {
  modalService = inject(ModalService);
}
