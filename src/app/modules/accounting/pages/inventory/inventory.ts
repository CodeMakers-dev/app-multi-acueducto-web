import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Action, TableComponent } from '@components/table';
import { InventarioService } from '../../service/inventario.service';
import { ToastService } from '@services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IInventario } from '@interfaces/Iaccounting';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, RouterModule, TableComponent],
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
    [columns]="inventarioColumns()"
    [datasource]="inventarioData()"
    [actionTemplate]="actionsTemplate"
    (action)="onTableAction($event)"
    >
  </app-table-dynamic> 
`,
})
export class Inventory {
  showDeleteConfirm = signal(false);
  itemToDelete: number | null = null;

  inventarioColumns = signal([
    { field: 'nombre', header: 'Producto' },
    { field: 'cantidad', header: 'Cantidad (UND)' },
    { field: 'precioUnitario', header: 'Valor unidad' },
    { field: 'porcentaje', header: 'Porcentaje %' },
    { field: 'precioVenta', header: 'Valor venta' },
  ]);

  inventarioData = computed(() => this.dataInventarioCounter.value() ?? []);
  title = 'Gestion de Inventario';


  constructor() {
    effect(() => {
      console.log('InventarioData__________>', this.inventarioData());
    });
  }

  protected readonly inventarioService = inject(InventarioService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly toastService = inject(ToastService);

  dataInventarioCounter = rxResource({
  stream: () =>
    this.inventarioService.getInventarioByEnterprise().pipe(
      map((data: { response: IInventario[] }) => {
        return data.response.map((empresaItem) => ({
          id: empresaItem.id,
          nombre: empresaItem.nombre,
          cantidad: empresaItem.cantidad,
          precioUnitario: `$ ${empresaItem.precioUnitario}`,
          porcentaje: `% ${empresaItem.porcentaje}`,
          precioVenta: `$ ${empresaItem.precioVenta}`,
        }));
      })
    )
});

editar(row: any) {
    const id = row?.id;
    if (id) {
      this.router.navigate(['/inventory/update-inventory/', id], { relativeTo: this.route });
    } else {
      this.toastService.error('Error', 'ID de producto no válido.');
    }
  }

  onTableAction(event: Action) {
      if (event.action === 'add') {
        this.router.navigate(['create-inventory'], { relativeTo: this.route });
      } else if (event.action === 'edit' && event.row) {
        this.editar(event.row);
      }
    }

      onDelete(id: number): void {
    this.itemToDelete = id;
    this.showDeleteConfirm.set(true);
  }
}
