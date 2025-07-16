import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Footer } from "@components/footer/footer";
import { Header } from "@components/header/header";
import { Table } from '@components/table/table';
import { IDeudaCliente } from '@interfaces/IdeudaFactura';
import { TableColumn } from '@interfaces/ItableColumn';
import { DeudaService } from '../../service/deuda.service';
import { ApiResponse } from '@interfaces/Iresponse';

@Component({
  selector: 'app-customer-debt',
  imports: [Header, CommonModule, Table, Footer, RouterModule],
  templateUrl: './customer-debt.html',
})
export class CustomerDebt implements OnInit {

   debtColumns: TableColumn[] = [
    { key: 'clienteNombreCompleto', label: 'Cliente', sortable: true },
    { key: 'facturaCodigo', label: 'Factura', sortable: true },
    { key: 'fechaDeudaTexto', label: 'Fecha deuda', sortable: true },
    { key: 'descripcion', label: 'Descripción', sortable: true },
    { key: 'tipoDeudaNombre', label: 'Tipo deuda', sortable: true },
    { key: 'valorTexto', label: 'Valor', sortable: true },
    { key: 'activo', label: 'Estado', sortable: true },
    { key: 'plazoPagoNombre', label: 'N° de cuotas', sortable: true },
  ];

  tableData: any[] = []; 
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly deudaService = inject(DeudaService);
  protected readonly router = inject(Router);

  ngOnInit(): void {
    this.loadDeuda();
  }

   irAbonoFactura() {
    this.router.navigate(['/bill/credit-customer']);
  }
  createdebt() {
    this.router.navigate(['/bill/create-debt']);
  }

  loadDeuda(): void {
  this.deudaService.getAllDeuda(
    this.currentPage,
    this.pageSize,
    this.searchTerm,
    this.currentSortColumn,
    this.currentSortDirection
  ).subscribe(
    (apiResponse: ApiResponse<IDeudaCliente[]>) => {
      const deudas = apiResponse.response;

      console.log('Respuesta completa de deudas:', deudas); 

      const deudasTransformadas = deudas.map((deuda, index) => {
        const cliente = deuda.empresaClienteContador?.cliente;

        const nombreCompleto = [
          cliente?.nombre,
          cliente?.segundoNombre,
          cliente?.apellido,
          cliente?.segundoApellido
        ]
          .filter(part => !!part)
          .join(' ');

        console.log(`Deuda [${index}]:`, {
          factura: deuda.factura,
          codigoFactura: deuda.factura?.codigo,
        });

        return {
          ...deuda,
          clienteNombreCompleto: nombreCompleto,
          tipoDeudaNombre: deuda.tipoDeuda?.nombre ?? '',
          fechaDeudaTexto: deuda.fechaDeuda?.toString().slice(0, 10),
          valorTexto: `$${parseFloat(deuda.valor).toLocaleString('es-CO')}`,
          facturaCodigo: deuda.factura?.codigo ?? '',
          plazoPagoNombre: deuda.plazoPago?.nombre ?? ''
        };
      });
      console.log('Deudas transformadas:', deudasTransformadas); 

      this.totalRegisters = deudas.length;
      this.tableData = deudasTransformadas;
    },
    error => {
      console.error('Error al cargar las deudas:', error);
    }
  );
}


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadDeuda();
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.currentSortColumn = event.column;
    this.currentSortDirection = event.direction;
    this.loadDeuda();
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadDeuda();
  }
 eliminarDeuda(id: number): void {
  if (confirm('¿Estás seguro de eliminar esta deuda?')) {
    this.deudaService.deleteDeudaById(id).subscribe({
      next: (res) => {
        console.log('Deuda eliminada correctamente:', res);
        this.loadDeuda(); 
      },
      error: (err) => {
        console.error('Error al eliminar la deuda:', err);
      }
    });
  }
}


}
