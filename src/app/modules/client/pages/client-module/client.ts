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
import { map } from 'rxjs';
import { PopupComponent } from "@shared/components/popUp";



@Component({
  selector: 'app-client',
  imports: [CommonModule, RouterModule, TableComponent, PopupComponent],
 template: `
  <ng-template #actionsTemplate let-row>
    <div class="flex items-center space-x-4">
      
      <button (click)="editar(row)"
        class="text-green-600 hover:text-green-900 text-sm cursor-pointer">
        <i class="fas fa-edit"></i>
      </button>

      
      <button (click)="onDelete(row.id)"
        class="text-red-600 hover:text-red-900 text-sm cursor-pointer">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </ng-template>

 
  <app-table-dynamic
    [title]="title"
    [columns]="clienteColumns()"
    [datasource]="clientData()"
    [actionTemplate]="actionsTemplate"
    [showAddButton]="true"
    [addButtonText]="'Agregar Cliente'"
    (action)="onTableAction($event)">
  </app-table-dynamic>

  
  <app-pop-up
    [open]="showDeleteConfirm"
    [isConfirmation]="true"
    [title]="'Eliminar Cliente'"
    [message]="'¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer.'"
    [confirmText]="'Eliminar'"
    [cancelText]="'Cancelar'"
    (confirmAction)="confirmDelete()">
  </app-pop-up>
`
,
})
export class Client {

  showDeleteConfirm = signal(false);
  itemToDelete: number | null = null;

  protected readonly toastService = inject(ToastService);

  clienteColumns = signal([
    { field: 'idContador', header: 'ID Contador' },
    { field: 'codigoVereda', header: 'Vereda' },
    { field: 'numeroIdentificacion', header: 'Número Identificación' },
    { field: 'razonSocial', header: 'Razón Social' },
    { field: 'nombreCliente', header: 'Nombre cliente' },
    { field: 'telefono', header: 'Teléfono' },
    { field: 'direccion', header: 'Dirección' },
    { field: 'correo', header: 'Correo' },
    { field: 'estado', header: 'Estado' },
  ]);

  clientData = computed(() => this.dataClientCounter.value() ?? []);
  title = 'Clientes';

  constructor() {
    effect(() => {
      console.log('clientData__________>', this.clientData());
    });
  }
  protected readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  dataClientCounter = rxResource({
    stream: () => this.enterpriseClientCounterService.getAllClienteEnterprise().pipe(
      map(data => {
        return (data.clientes ?? []).map(clienteItem => {
          const personaId = clienteItem.cliente?.id;
          const correo = data.correos.find(c => c.persona?.id === personaId)?.correo ?? '';
          const telefono = data.telefonos.find(t => t.persona?.id === personaId)?.numero ?? '';

          return {
            idpersona: clienteItem.id,
            id: clienteItem.cliente?.id,
            idContador: clienteItem.contador?.serial ?? '',
            codigoDepart: clienteItem.cliente?.direccion?.departamentoId?.nombre ?? '',
            codigoMuni: clienteItem.cliente?.direccion?.ciudadId?.nombre ?? '',
            codigoVereda: clienteItem.cliente?.direccion?.corregimientoId?.nombre ?? '',
            numeroIdentificacion: clienteItem.cliente?.numeroCedula ?? '',
            razonSocial: clienteItem.empresa?.nombre ?? '',
            nombreCliente: `${clienteItem.cliente?.nombre ?? ''} ${clienteItem.cliente?.segundoNombre ?? ''} ${clienteItem.cliente?.apellido ?? ''} ${clienteItem.cliente?.segundoApellido ?? ''}`,
            telefono,
            direccion: clienteItem.cliente?.direccion?.descripcion ?? '',
            correo,
            estado: clienteItem.activo,
          };
        });
      })
    )

  });

  onToggle(row: any) {
    row.activo = !row.activo;
    this.toastService.success('Éxito', 'Estado actualizado correctamente');
  }
  onDelete(id: number): void {
    this.itemToDelete = id;
    this.showDeleteConfirm.set(true);
  }

 editar(row: any) {
  const id = row?.idpersona;
  if (id) {
    this.router.navigate(['/client/update-client/', id], { relativeTo: this.route });
  } else {
    this.toastService.error('Error', 'ID del cliente no válido.');
  }
}

 confirmDelete(): void {
  if (this.itemToDelete !== null) {
    this.enterpriseClientCounterService.deleteClient(this.itemToDelete).subscribe({
      next: () => {
        this.toastService.success('Eliminado', 'Cliente eliminado correctamente.');
        this.dataClientCounter.reload?.();
      },
      error: () => {
        this.toastService.error('Error', 'No se pudo eliminar el cliente.');
      },
      complete: () => {
        this.showDeleteConfirm.set(false);
        this.itemToDelete = null;
      }
    });
  }
}

onTableAction(event: Action) {
  if (event.action === 'add') {
    this.router.navigate(['create-client'], { relativeTo: this.route });
  } else if (event.action === 'edit' && event.row) {
    this.editar(event.row);
  }
}


}
