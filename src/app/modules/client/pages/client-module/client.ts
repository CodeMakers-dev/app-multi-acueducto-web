import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import {
  Action,
  TableComponent,
} from '../../../../core/components/table';
import { EnterpriseClientCounterService } from '../../service/enterpriseClientCounter.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ToastService } from '@services/toast.service';



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

        <ng-template #estadoTpl let-row>
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

  protected readonly toastService = inject(ToastService);

clienteColumns = signal([
  { field: 'codigo', header: 'Código' },
  { field: 'nombre', header: 'Nombres' },
  { field: 'apellido', header: 'Primer Apellido' },
  { field: 'segundoApellido', header: 'Segundo Apellido' },
  { field: 'numeroCedula', header: 'Número Cédula' }
]);
  clientData = computed(() => this.dataClientCounter.value() ?? []);
  title = 'Clientes';

  protected readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  dataClientCounter = rxResource({
    stream: () => this.enterpriseClientCounterService.getAllClienteEnterprise(),
  });

  onToggle(row: any) {
    row.activo = !row.activo;
    this.toastService.success('Éxito', 'Estado actualizado correctamente');

  }

  handleTableAction(event: Action) {
    console.log('Action received:', event);
    if (event.action === 'add') {
      this.router.navigate(['create-client'], { relativeTo: this.route });
    }
  }
}
