import { NgTemplateOutlet } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, output, TemplateRef, signal, computed } from '@angular/core';

export interface Action<T = any> {
  action: string;
  row?: T;
}

@Component({
  selector: 'app-table-dynamic',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="px-4 sm:px-6 lg:px-8 py-6 pb-0">
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
          {{ title() }}
        </h1>
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div class="w-full max-w-sm">
            <input
              type="text"
              placeholder="Buscar..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              (input)="onSearchInput($event)"
            />
          </div>
          @if (showAddButton()) {
            <button
              class="bg-blue-200 hover:bg-blue-400 text-gray-700 font-bold py-3 px-6 rounded-lg shadow-lg shadow-neutral-400  hover:text-white transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce flex items-center gap-2 whitespace-nowrap"
              (click)="onAction('add', null)">
              <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
              </svg>
              {{ addButtonText() }}
            </button>
          }
        </div>
      </div>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mx-4 sm:mx-6 lg:mx-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            @for (column of columns(); track column.field) {
  <th scope="col" class="px-6 py-3">{{ column.header }}</th>
}
            <th scope="col" class="px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          @if (filtered().length) {
            @for (row of filtered(); track trackById($index, row)) {
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-600"
              >
               @for (column of columns(); track column.field) {
  <td class="px-6 py-4 text-gray-900 dark:text-white">
    @if (columnTemplates()[column.field]) {
      <ng-container
        [ngTemplateOutlet]="columnTemplates()[column.field]"
        [ngTemplateOutletContext]="{ $implicit: row, row: row }"
      />
    } @else {
      {{ row[column.field] }}
    }
  </td>
}
                <td class="px-6 py-4 text-right">
                  @if (actionTemplate()) {
                    <ng-container
                      [ngTemplateOutlet]="actionTemplate()"
                      [ngTemplateOutletContext]="{ $implicit: row, row: row }"
                    />
                  } @else {
                    <button
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      (click)="onAction('edit', row)"
                    >
                      Edit
                    </button>
                  }
                </td>
              </tr>
            }
          } @else {
            <tr>
              <td
                [attr.colspan]="columns().length + 1"
                class="text-center py-6 text-gray-400 dark:text-gray-500"
              >
                Sin registros
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  columns = input<{ field: string; header: string }[]>([]);
  title          = input<string>('');
  datasource     = input<any[]>([]);
  actionTemplate = input<TemplateRef<any> | null>(null);
  showAddButton  = input<boolean>(false);
  addButtonText  = input<string>('Agregar');
  action         = output<Action>();
  search         = signal<string>('');
  columnTemplates = input<Record<string, TemplateRef<any>>>({});

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.search.set(target?.value ?? '');
  }

  onAction(type: string, row: any) {
    this.action.emit({ action: type, row });
  }

  filtered = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.datasource() ?? [];
    return (this.datasource() ?? []).filter(row =>
  this.columns().some(col =>
    String(row[col.field] ?? '')
      .toLowerCase()
      .includes(term)
  )
);
  });

  trackById = (_: number, row: any) => row.id ?? _;
}
