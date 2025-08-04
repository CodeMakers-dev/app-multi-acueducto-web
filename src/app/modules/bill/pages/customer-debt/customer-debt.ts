import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Table } from '@components/table/table';
import { IDeudaCliente } from '@interfaces/IdeudaFactura';
import { TableColumn } from '@interfaces/ItableColumn';
import { DeudaService } from '../../service/deuda.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { ToastService } from '@services/toast.service';
import { TableComponent } from '@components/table';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-customer-debt',
  imports: [CommonModule, TableComponent, RouterModule],
  templateUrl: './customer-debt.html',
})
export class CustomerDebt {

  debtColumns = signal<{ field: string; header: string }[]>([
    { field: 'clienteNombreCompleto', header: 'Cliente' },
    { field: 'facturaCodigo', header: 'Factura' },
    { field: 'fechaDeudaTexto', header: 'Fecha deuda' },
    { field: 'descripcion', header: 'Descripción' },
    { field: 'tipoDeudaNombre', header: 'Tipo deuda' },
    { field: 'valorTexto', header: 'Valor' },
    { field: 'activo', header: 'Estado' },
    { field: 'plazoPagoNombre', header: 'N° de cuotas' }
  ]);

  protected readonly deudaService = inject(DeudaService);
  protected readonly toastService = inject(ToastService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      console.log(
        'Data loaded______:',
        this.dataDebts.value()
      );
    });
  }

  dataDebts = rxResource({
    stream: () => this.deudaService.getAllDeuda(
    ).pipe(
      map((apiRes: ApiResponse<IDeudaCliente[]>) =>
        apiRes.response.map(deuda => ({
          id: deuda.id,
          clienteNombreCompleto: [
            deuda.empresaClienteContador?.cliente?.nombre ?? '',
            deuda.empresaClienteContador?.cliente?.segundoNombre ?? '',
            deuda.empresaClienteContador?.cliente?.apellido ?? '',
            deuda.empresaClienteContador?.cliente?.segundoApellido ?? ''
          ].filter(Boolean).join(' '),
          facturaCodigo: deuda.factura?.codigo ?? '',
          fechaDeudaTexto: new Date(deuda.fechaDeuda!).toLocaleDateString('es-CO'),
          descripcion: deuda.descripcion ?? '',
          tipoDeudaNombre: deuda.tipoDeuda?.nombre ?? '',
          valorTexto: `$${parseFloat(deuda.valor).toLocaleString('es-CO')}`,
          activo: deuda.activo ? 'PENDIENTE' : 'PAGO',
          plazoPagoNombre: deuda.plazoPago?.nombre ?? ''
        }))
      )
    )
  });

  debtData = computed(() => this.dataDebts.value() ?? []);
  title = signal('Deuda de clientes');


  handleTableAction(event: { action: string; row?: any }) {
  switch (event.action) {
    case 'edit':
      this.router.navigate(['/bill/update-debt', event.row.id]);
      break;
    case 'delete':
      this.confirmDelete(event.row?.id);
      break;
    case 'add':
      this.irAbonoFactura();
      break;
  }
}


  confirmDelete(id: number) {
    if (confirm('¿Eliminar deuda?')) {
      this.deudaService.deleteDeudaById(id).subscribe({
        next: () => {
          this.toastService.success('Éxito', 'Deuda eliminada');
          this.dataDebts.reload?.();
        },
        error: () => this.toastService.error('Error', 'No se pudo eliminar')
      });
    }
  }

  createdebt() { this.router.navigate(['/bill/create-debt']); }
  irAbonoFactura() { this.router.navigate(['/bill/credit-customer']); }
  redirigirCrearAbono(id: number) { this.router.navigate(['/bill/create-credit', id]); }


}
