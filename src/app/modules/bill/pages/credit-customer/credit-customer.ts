import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Table } from '@components/table/table';
import { TableColumn } from '@interfaces/ItableColumn';
import { AbonoService } from '../../service/abono.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { IAbonoFactura } from '@interfaces/IdeudaFactura';

@Component({
  selector: 'app-credit-customer',
  imports: [CommonModule, Table, RouterModule],
  templateUrl: './credit-customer.html',

})
export class CreditCustomer implements OnInit {

   abonoColumns: TableColumn[] = [

  { key: 'codigoFactura', label: 'Código factura', sortable: true },
  { key: 'valorDeudaTexto', label: 'Valor deuda', sortable: true },
  { key: 'fechaAbonoTexto', label: 'Fecha abono', sortable: true },
  { key: 'valorTexto', label: 'Valor abono', sortable: true }
];

  tableData: any[] = [];
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly abonoService = inject(AbonoService);

  ngOnInit(): void {
    this.loadAbono();
  }

  loadAbono(): void {
  this.abonoService.getAllAbono(
    this.currentPage,
    this.pageSize,
    this.searchTerm,
    this.currentSortColumn,
    this.currentSortDirection
  ).subscribe(
    (apiResponse: ApiResponse<IAbonoFactura[]>) => {
      const abonos = apiResponse.response;

      const abonosTransformados = abonos.map(abono => {
        const valorDeuda = abono.deudaCliente?.valor || '0';
        const valorAbono = abono.valor || '0';

        return {
          ...abono,
          valorDeudaTexto: `$${parseFloat(valorDeuda).toLocaleString('es-CO')}`,
          valorTexto: `$${parseFloat(valorAbono).toLocaleString('es-CO')}`,
          fechaAbonoTexto: abono.fechaCreacion?.toString().slice(0, 10)
        };
      });

      this.totalRegisters = abonos.length;
      this.tableData = abonosTransformados;
    },
    error => {
      console.error('Error al cargar los abonos:', error);
    }
  );
}


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadAbono();
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.currentSortColumn = event.column;
    this.currentSortDirection = event.direction;
    this.loadAbono();
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadAbono();
  }
}
