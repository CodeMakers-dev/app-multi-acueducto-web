import { Component, inject, OnInit } from '@angular/core';
import { Table } from '@components/table/table';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableColumn } from '@interfaces/ItableColumn';
import { IFactura, IfacturaResponse } from '@interfaces/Ifactura';
import { FacturaService } from '../../service/factura.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { ToastService } from '@services/toast.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Navigation } from "@components/navigation/navigation";



@Component({
  selector: 'app-bill',
  imports: [ CommonModule, Table,  RouterModule, Navigation],
  templateUrl: './bill.html',
})
export class Bill implements OnInit {



  billColumns: TableColumn[] = [
    { key: 'codigo', label: 'Codigo', sortable: true },
    { key: 'clienteNombreCompleto', label: 'Cliente', sortable: true },
    { key: 'consumo', label: 'Consumo(m³)', sortable: true },
    { key: 'fechaEmisionTexto', label: 'Fecha emision', sortable: true },
    { key: 'fechaFinTexto', label: 'Fecha Fin', sortable: true },
    { key: 'estadoNombre', label: 'Estado', sortable: true },
    { key: 'consumoAnormal', label: 'Consumo anormal', sortable: false },
    { key: 'precioTexto', label: 'Total', sortable: true },
  ];

  tableData: IfacturaResponse[] = [];
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly facturaService = inject(FacturaService);

  protected readonly router = inject(Router);

  protected readonly toastService = inject(ToastService);


  ngOnInit(): void {
    this.loadFacturas();
  }

  irADeudaCliente() {
    this.router.navigate(['/bill/customer-debt']);
  }

  loadFacturas(): void {
    this.facturaService.getAllFactura(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.currentSortColumn,
      this.currentSortDirection
    ).subscribe(
      (apiResponse: ApiResponse<IfacturaResponse[]>) => {
        const facturas = apiResponse.response;
        const facturasConNombreCompleto = facturas.map(factura => {
          const nombreCompleto = [
            factura.nombre,
            factura.segundoNombre,
            factura.apellido,
            factura.segundoApellido
          ]
            .filter(part => !!part)
            .join(' ');

          return {
            ...factura,
            clienteNombreCompleto: nombreCompleto,
            consumoAnormal: factura.consumoAnormal ? 'SI' : 'NO',
            fechaEmisionTexto: factura.fechaEmision?.toString().slice(0, 10),
            fechaFinTexto: factura.fechaFin?.toString().slice(0, 10),
            precioTexto: `$${Number(factura.precio).toLocaleString()}`
          };
        });

        this.totalRegisters = facturas.length;
        this.tableData = facturasConNombreCompleto;
      },
      error => {
        console.error('Error al cargar las facturas:', error);
      }
    );
  }


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadFacturas();
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.currentSortColumn = event.column;
    this.currentSortDirection = event.direction;
    this.loadFacturas();
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadFacturas();
  }

  viewClient(client: IFactura): void {
    console.log('Ver detalles de cliente:', client);
  }

  descargarHistorial(): void {
    const exportData = this.tableData.map((factura: any) => {
      const row: any = {};
      this.billColumns.forEach(column => {
        const keys = column.key.split('.');
        let value = factura;
        for (const key of keys) {
          value = value?.[key];
        }
        row[column.label] = value ?? '';
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

    const blob: Blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    FileSaver.saveAs(blob, `Historial_Facturas_${new Date().toISOString()}.xlsx`);
  }

  deleteClient(id: number): void {
    console.log('Eliminando factura con id:', id);
    this.toastService.warning('Eliminar factura', '¿Estás seguro de que deseas eliminar esta factura?');
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      this.facturaService.deleteFacturaById(id).subscribe({
        next: (response) => {
          this.toastService.success('Eliminado', 'La factura ha sido eliminada correctamente.');
          this.loadFacturas();
        },
        error: (err) => {
          this.toastService.error('Error', 'Ocurrió un error al eliminar la factura.');
          console.error('Error al eliminar factura:', err.message);
        }
      });
    }
  }
}