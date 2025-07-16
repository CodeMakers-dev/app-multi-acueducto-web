import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 w-80 space-y-3">
      @for (toast of service.toasts$ | async; track $index) {
      <ng-container>
        <div
          class="toast flex items-start p-4 rounded-lg border shadow-lg"
          [ngClass]="colorMap[toast.type]"

        >
          <div class="flex-shrink-0" [innerHTML]="iconMap[toast.type]"></div>
          <div class="ml-3">
            <h3 class="text-sm font-medium" [ngClass]="titleColor[toast.type]">
              {{ toast.title }}
            </h3>
            <p class="mt-1 text-sm" [ngClass]="textColor[toast.type]">
              {{ toast.message }}
            </p>
          </div>
          <button
            class="ml-auto opacity-70 hover:opacity-100"
            (click)="service.dismiss(toast.id)"
          >
            ✕
          </button>
        </div>
      </ng-container>
      }
    </div>
  `,
  styles: [
    `
      .toast {
        animation: slideIn 0.5s forwards, fadeOut 0.5s forwards 3.8s;
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes fadeOut {
        to {
          opacity: 0;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {

  service = inject(ToastService);

  colorMap = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50   border-red-100',
    warning: 'bg-yellow-50 border-yellow-100',
    info: 'bg-indigo-50 border-indigo-100',
  };
  titleColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-indigo-800',
  };
  textColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-indigo-600',
  };

  iconMap = {
    success: `<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9
                 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1
                 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>`,

    error: `<svg class="w-5 h-5 text-red-500" ...></svg>`,
    warning: `<svg class="w-5 h-5 text-yellow-500" ...></svg>`,
    info: `<svg class="w-5 h-5 text-indigo-500" ...></svg>`,
  };
}
