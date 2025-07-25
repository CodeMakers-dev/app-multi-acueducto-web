import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from '@services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (breadcrumbService.breadcrumbs().length > 0) {
      <nav class="flex bg-gray-50 px-4 py-2 mt-16 pl-9" aria-label="Breadcrumb">
        <div class="max-w-screen-xl mx-auto w-full">
          <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            @for (item of breadcrumbService.breadcrumbs(); track $index) {
              <li [class]="$index === 0 ? 'inline-flex items-center' : ''">
                @if ($index === 0) {
                  <!-- Primer elemento con ícono home -->
                  @if (!item.isActive) {
                    <a
                      [routerLink]="item.url"
                      class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                      <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                      </svg>
                      {{ item.label }}
                    </a>
                  } @else {
                    <span class="inline-flex items-center text-sm font-medium text-gray-500">
                      <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                      </svg>
                      {{ item.label }}
                    </span>
                  }
                } @else {
                  <!-- Otros elementos -->
                  <div class="flex items-center">
                    <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    @if (!item.isActive) {
                      <a
                        [routerLink]="item.url"
                        class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">
                        {{ item.label }}
                      </a>
                    } @else {
                      <span
                        class="ms-1 text-sm font-medium text-gray-500 md:ms-2"
                        aria-current="page">
                        {{ item.label }}
                      </span>
                    }
                  </div>
                }
              </li>
            }
          </ol>
        </div>
      </nav>
    }
  `
})
export class BreadcrumbComponent {
  breadcrumbService = inject(BreadcrumbService);
}
