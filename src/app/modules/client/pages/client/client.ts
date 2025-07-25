import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Action,
  TableComponent,
} from '../../../../../app/core/components/table';
import { EnterpriseClientCounterService } from '../../service/enterpriseClientCounter.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client',
  imports: [CommonModule, RouterModule, TableComponent],
  template: `
    <ng-template #toggleTpl let-row>
      <label class="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          [checked]="row.activo"
          (change)="onToggle(row)"
        />
        <div
          class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full
             peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
             after:content-[''] after:absolute after:top-[2px] after:start-[2px]
             after:bg-white after:border-gray-300 after:border after:rounded-full
             after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
        ></div>
      </label>
    </ng-template>

    <app-table-dynamic
      [title]="title"
      [columns]="clienteColumns()"
      [datasource]="clientData()"
      [actionTemplate]="toggleTpl"
      [showAddButton]="true"
      [addButtonText]="'Agregar Cliente'"
      (action)="handleTableAction($event)"
    >
    </app-table-dynamic>
  `,
})
export class Client {
  clienteColumns = signal(['codigo', 'nombre', 'numeroCedula', 'apellido']);
  clientData = computed(() => this.dataClientCounter.value() ?? []);
  title = 'Clientes';

  protected readonly enterpriseClientCounterService = inject(
    EnterpriseClientCounterService
  );

  dataClientCounter = rxResource({
    stream: () => this.enterpriseClientCounterService.getAllClienteEnterprise(),
  });

  onToggle(row: any) {
    row.activo = !row.activo;
  }

  handleTableAction(event: Action) {
    alert(`Action: ${event.action} on row: ${JSON.stringify(event.row)}`);
  }
}
