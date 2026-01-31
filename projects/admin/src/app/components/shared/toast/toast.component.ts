import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          [@toastAnimation]
          class="pointer-events-auto flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-md border border-opacity-20 transform transition-all duration-300 overflow-hidden relative"
          [ngClass]="{
            'bg-white/95 border-emerald-200 text-emerald-800 dark:bg-gray-800/95 dark:border-emerald-800 dark:text-emerald-100': toast.type === 'success',
            'bg-white/95 border-rose-200 text-rose-800 dark:bg-gray-800/95 dark:border-rose-800 dark:text-rose-100': toast.type === 'error',
            'bg-white/95 border-amber-200 text-amber-800 dark:bg-gray-800/95 dark:border-amber-800 dark:text-amber-100': toast.type === 'warning',
            'bg-white/95 border-sky-200 text-sky-800 dark:bg-gray-800/95 dark:border-sky-800 dark:text-sky-100': toast.type === 'info'
          }"
        >
          <!-- Icon -->
          <div class="shrink-0 mr-3">
             @if(toast.type === 'success') {
                <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             } @else if(toast.type === 'error') {
                <svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             } @else if(toast.type === 'warning') {
                <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
             } @else {
                <svg class="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             }
          </div>

          <div class="flex-1 text-sm font-bold tracking-wide">{{ toast.message }}</div>
          
          <button (click)="toastService.remove(toast.id)" class="ml-4 opacity-70 hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

           <div class="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 w-full animate-shrink-width" [style.animation-duration.ms]="toast.duration || 3000"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes shrink-width {
      from { width: 100%; }
      to { width: 0%; }
    }
    .animate-shrink-width {
      animation-name: shrink-width;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
    }
  `],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%) scale(0.9)', opacity: 0 }),
        animate('350ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0) scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateX(100%) scale(0.9)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
