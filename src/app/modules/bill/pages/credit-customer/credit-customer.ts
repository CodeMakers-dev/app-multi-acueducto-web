import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Table } from '@components/table/table';
import { TableColumn } from '@interfaces/ItableColumn';
import { AbonoService } from '../../service/abono.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { IAbonoFactura } from '@interfaces/IdeudaFactura';
import { Navigation } from "@components/navigation/navigation";

@Component({
  selector: 'app-credit-customer',
<<<<<<< HEAD
  imports: [CommonModule, Table, RouterModule],
=======
  imports: [Header, CommonModule, Table, Footer, RouterModule, Navigation],
>>>>>>> 2e9665dd6b0419140d14d4045e1c4a2436ad7830
  templateUrl: './credit-customer.html',

})
export class CreditCustomer implements OnInit {

<<<<<<< HEAD
   abonoColumns: TableColumn[] = [

  { key: 'codigoFactura', label: 'Código factura', sortable: true },
  { key: 'valorDeudaTexto', label: 'Valor deuda', sortable: true },
  { key: 'fechaAbonoTexto', label: 'Fecha abono', sortable: true },
  { key: 'valorTexto', label: 'Valor abono', sortable: true }
];

=======
  abonoColumns: TableColumn[] = [
    { key: 'clienteFactura', label: 'Cliente', sortable: true },
    { key: 'codigoFactura', label: 'Código factura', sortable: true },
    { key: 'fechaAbonoTexto', label: 'Fecha abono', sortable: true },
    { key: 'valorTexto', label: 'Valor abono', sortable: true }
  ];
>>>>>>> 2e9665dd6b0419140d14d4045e1c4a2436ad7830
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
          const codigoFactura = abono.deudaCliente?.factura?.codigo || 'Sin código';

          const cliente = abono.deudaCliente?.empresaClienteContador?.cliente;

          const clienteNombreCompleto = cliente
            ? `${cliente.nombre ?? ''} ${cliente.segundoNombre ?? ''} ${cliente.apellido ?? ''} ${cliente.segundoApellido ?? ''}`.trim().replace(/\s+/g, ' ')
            : 'Sin cliente';

          return {
            ...abono,
            codigoFactura,
            clienteFactura: clienteNombreCompleto,
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
