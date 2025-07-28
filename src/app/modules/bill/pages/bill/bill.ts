import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Table } from '@components/table/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TableColumn } from '@interfaces/ItableColumn';
import { IFactura, IfacturaResponse } from '@interfaces/Ifactura';
import { FacturaService } from '../../service/factura.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { ToastService } from '@services/toast.service';
import * as XLSX from 'xlsx';

import * as FileSaver from 'file-saver';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TableComponent } from '@components/table';

@Component({
  selector: 'app-bill',
  imports: [ CommonModule, TableComponent,  RouterModule],
  templateUrl: './bill.html',
})
export class Bill {

  billColumns = signal([
    { field: 'codigo', header: 'Código' },
    { field: 'clienteNombreCompleto', header: 'Cliente' },
    { field: 'consumo', header: 'Consumo (m³)' },
    { field: 'fechaEmisionTexto', header: 'Fecha emisión' },
    { field: 'fechaFinTexto', header: 'Fecha fin' },
    { field: 'estadoNombre', header: 'Estado' },
    { field: 'consumoAnormal', header: 'Consumo anormal' },
    { field: 'precioTexto', header: 'Total' },
  ]);

  protected readonly billService = inject(FacturaService);
  protected readonly toastService = inject(ToastService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  dataBills = rxResource({
    stream: () =>
      this.billService.getAllBill().pipe(
        map((apiRes: ApiResponse<IfacturaResponse[]>) =>
          apiRes.response.map(factura => {
            const fullName = [
              factura.nombre || '',
              factura.segundoNombre || '',
              factura.apellido || '',
              factura.segundoApellido || '',
            ].filter(Boolean).join(' ');

            const fechaEmision = new Date(factura.fechaEmision);
            const fechaFin = new Date(factura.fechaFin);

            return {
              id: factura.id,
              codigo: factura.codigo,
              clienteNombreCompleto: fullName,
              consumo: factura.consumo,
              fechaEmisionTexto: fechaEmision.toLocaleDateString('es-CO'),
            fechaFinTexto: fechaFin.toLocaleDateString('es-CO'),
              estadoNombre: factura.estadoNombre,
              consumoAnormal: factura.consumoAnormal ? 'SI' : 'NO',
              precioTexto: `$${Number(factura.precio).toLocaleString()}`,
            };
          })
        )
      )
  });

  tableData = computed(() => this.dataBills.value() ?? []);
  title = signal('Gestión de Facturas');

  goToCustomerDebt(): void {
    this.router.navigate(['/bill/customer-debt']);
  }


  handleTableAction(event: { action: string; row?: any }): void {
  if (event.action === 'add') {
    this.goToCustomerDebt();
  }
  else if (event.action === 'edit' && event.row) {
    this.router.navigate(['/bill/update-bill', event.row.id], { relativeTo: this.route });
  }
  else if (event.action === 'delete' && event.row) {
    this.onDelete(event.row.id);
  }
}

  onDelete(id: number): void {
    if (confirm('¿Desea eliminar esta factura?')) {
      this.billService.deleteFacturaById(id).subscribe({
        next: () => {
          this.toastService.success('Eliminado', 'Factura eliminada correctamente.');
          this.dataBills.reload?.();
        },
        error: () => {
          this.toastService.error('Error', 'No se pudo eliminar la factura.');
        },
      });
    }
  }

  downloadHistory(): void {
  const data = this.tableData();
  const cols = this.billColumns();

  const exportData = data.map(factura => {
    const row: Record<string, any> = {};
    cols.forEach(col => {
      const value = factura[col.field as keyof typeof factura];
      row[col.header] = value ?? '';
    });
    return row;
  });

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Historial de Facturas': worksheet },
    SheetNames: ['Historial de Facturas']
  };

  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  FileSaver.saveAs(blob, `Historial_Facturas_${new Date().toISOString()}.xlsx`);
  this.toastService.success('Descarga completa', 'Historial de facturas descargado con éxito.');
}


}
