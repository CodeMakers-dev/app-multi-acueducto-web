import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Table } from '@components/table/table';
import { IPerson } from '@interfaces/Iperson';
import { TableColumn } from '@interfaces/ItableColumn';
import { ApiResponse } from '@interfaces/Iresponse';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { EnterpriseClientCounterService } from '../../service/enterpriseClientCounter.service';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';

@Component({
  selector: 'app-client',
  imports: [Header, CommonModule, Table, Footer],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client implements OnInit {

  clientColumns: TableColumn[] = [
    { key: 'empresa.nombre', label: 'Razón Social Empresa', sortable: true },
    { key: 'cliente.tipoDocumento.nombre', label: 'Tipo Doc. Cliente', sortable: true },
    { key: 'cliente.numeroCedula', label: 'No. Doc. Cliente', sortable: true },
    { key: 'cliente.nombre', label: 'Nombre Cliente', sortable: true },
    { key: 'cliente.apellido', label: 'Apellido Cliente', sortable: true },
    { key: 'cliente.direccion.ciudadId.nombre', label: 'Ciudad Cliente', sortable: true },
    { key: 'cliente.direccion.corregimientoId.nombre', label: 'Corregimiento Cliente', sortable: true },
    { key: 'contador.serial', label: 'Serial Contador', sortable: true },
    { key: 'contador.tipoContador.nombre', label: 'Tipo Contador', sortable: true },
    { key: 'empresa.estado.descripcion', label: 'Estado Empresa', sortable: true }
  ];

  tableData: IEnterpriseClientCounter[] = [];
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);

  ngOnInit(): void {
    this.loadClients();
  }
  
  loadClients(): void {
    this.enterpriseClientCounterService.getAllEnterpriseClientCounters(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.currentSortColumn,
      this.currentSortDirection
    ).subscribe(
      (apiResponse: ApiResponse<IEnterpriseClientCounter[]>) => {
        this.tableData = apiResponse.response;
        this.totalRegisters = apiResponse.response.length;
        console.log('Datos de Empresa-Cliente-Contador cargados:', this.tableData);
      },
      error => {
        console.error('Error al cargar la vinculación Empresa-Cliente-Contador:', error);
      }
    );
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadClients();
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.currentSortColumn = event.column;
    this.currentSortDirection = event.direction;
    this.loadClients();
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadClients();
  }

  addNewClient(): void {
    console.log('Añadir nuevo cliente');
  }

  editClient(client: IPerson): void {
    console.log('Editar cliente:', client);
  }

  deleteClient(client: IPerson): void {
    console.log('Eliminar cliente:', client);
  }

  viewClient(client: IPerson): void {
    console.log('Ver detalles de cliente:', client);
  }
}
