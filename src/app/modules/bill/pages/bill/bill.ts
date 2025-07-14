import { Component, inject, OnInit } from '@angular/core';
import { Header } from "@components/header/header";
import { Footer } from "@components/footer/footer";
import { Table } from '@components/table/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableColumn } from '@interfaces/ItableColumn';
import { IFactura } from '@interfaces/Ifactura';
import { FacturaService } from '../../service/factura.service';
import { ApiResponse } from '@interfaces/Iresponse';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill',
  imports: [Header, CommonModule, Table, Footer, RouterModule],
  templateUrl: './bill.html',
  styleUrl: './bill.css'
})
export class Bill implements OnInit {

  billColumns: TableColumn[] = [
    { key: 'codigo', label: 'Codigo', sortable: true },
    { key: 'clienteNombreCompleto', label: 'Cliente', sortable: true },
    { key: 'consumo', label: 'Consumo(m³)', sortable: true },
    { key: 'fechaEmisionTexto', label: 'Fecha emision', sortable: true },
    { key: 'fechaFinTexto', label: 'Fecha Fin', sortable: true },
    { key: 'estado.nombre', label: 'Estado', sortable: true },
    { key: 'consumoAnormal', label: 'Consumo anormal', sortable: false },
    { key: 'precioTexto', label: 'Total', sortable: true },
  ];

  tableData: IFactura[] = [];
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly facturaService = inject(FacturaService);

  ngOnInit(): void {
    this.loadFacturas();
  }

  loadFacturas(): void {
    this.facturaService.getAllFactura(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.currentSortColumn,
      this.currentSortDirection
    ).subscribe(
      (apiResponse: ApiResponse<IFactura[]>) => {
        const facturas = apiResponse.response;

        const facturasConNombreCompleto = facturas.map(factura => {
          const cliente = factura.empresaClienteContador?.cliente;
          const nombreCompleto = [
            cliente?.nombre,
            cliente?.segundoNombre,
            cliente?.apellido,
            cliente?.segundoApellido
          ]
            .filter(part => !!part)
            .join(' ');

          return {
            ...factura,
            clienteNombreCompleto: nombreCompleto,
            consumoAnormal: factura.lectura?.consumoAnormal ? 'SI' : 'NO',
            fechaEmisionTexto: factura.fechaEmision?.toString().slice(0, 10),
            fechaFinTexto: factura.fechaFin?.toString().slice(0, 10),
            precioTexto: `$${factura.precio?.toLocaleString()}`
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

  addNewClient(): void {
    console.log('Añadir nuevo cliente');
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta factura?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.deleteFacturaById(id).subscribe({
          next: (response) => {
            Swal.fire('Eliminado', 'La factura ha sido eliminada correctamente.', 'success');
            this.loadFacturas();
          },
          error: (err) => {
            Swal.fire('Error', 'Ocurrió un error al eliminar la factura.', 'error');
            console.error('Error al eliminar factura:', err.message);
          }
        });
      }
    });
  }
}
