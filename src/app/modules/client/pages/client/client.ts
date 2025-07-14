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
import { RouterModule } from '@angular/router';
import { CorreoPersonaService } from '../../service/correoPersona.service';
import { TelefonoPersonaService } from '../../service/telefonoPersona.service';

@Component({
  selector: 'app-client',
  imports: [Header, CommonModule, Table, Footer,RouterModule],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client implements OnInit {

  clientColumns: TableColumn[] = [
    { key: 'contador.serial', label: 'Serial Contador', sortable: true },
    { key: 'cliente.direccion.corregimientoId.nombre', label: 'Codigo vereda', sortable: true },
    { key: 'cliente.numeroCedula', label: 'No. Doc. Cliente', sortable: true },
    { key: 'empresa.nombre', label: 'Razón Social Empresa', sortable: true },
    { key: 'cliente.nombre', label: 'Nombre Cliente', sortable: true },
    { key: 'cliente.apellido', label: 'Apellido Cliente', sortable: true },
    { key: 'telefonoPrincipal', label: 'Teléfono', sortable: true },
    { key: 'cliente.direccion.descripcion', label: 'Direccion', sortable: true },
    { key: 'correoPrincipal', label: 'Correo', sortable: true },
  ];

  tableData: IEnterpriseClientCounter[] = [];
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  protected readonly correoService = inject(CorreoPersonaService);
  protected readonly telefonoService = inject(TelefonoPersonaService);

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
      const clients = apiResponse.response;
      this.totalRegisters = clients.length;

      console.log('🔍 Clientes obtenidos:', clients);

      this.correoService.getAllTypeDocument().subscribe(correosResp => {
        const correos = correosResp.response;

        this.telefonoService.getAllTelefono().subscribe(telefonosResp => {
          const telefonos = telefonosResp.response;
          clients.forEach(client => {
            const personaId = client.cliente.id;
            const correosPersona = correos.filter(c => c.persona.id === personaId);
            const telefonosPersona = telefonos.filter(t => t.persona.id === personaId);
            client.cliente.correo = correosPersona;
            client.cliente.telefono = telefonosPersona;
            (client as any).correoPrincipal = correosPersona[0]?.correo || 'Sin correo';
            (client as any).telefonoPrincipal = telefonosPersona[0]?.numero || 'Sin teléfono';
          });

          this.tableData = clients;
        });
      });
    },
    error => {
      console.error('❌ Error al cargar Empresa-Cliente-Contador:', error);
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
