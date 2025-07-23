import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Table } from '@components/table/table';
import { IPerson } from '@interfaces/Iperson';
import { TableColumn } from '@interfaces/ItableColumn';
import { ApiResponse } from '@interfaces/Iresponse';
import { EnterpriseClientCounterService } from '../../service/enterpriseClientCounter.service';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { RouterModule } from '@angular/router';
import { CorreoPersonaService } from '../../service/correoPersona.service';
import { TelefonoPersonaService } from '../../service/telefonoPersona.service';

@Component({
  selector: 'app-client',
  imports: [CommonModule, Table, RouterModule],
  template: `
  <div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestión de Clientes</h1>

  <div class="mb-4 flex justify-between items-center">
    <input type="text" placeholder="Buscar..." class="border p-2 rounded-md w-1/3" (input)="onSearchInput($event)" />
    <button [routerLink]="['/client/create-client']"
  class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md cursor-pointer">
  Añadir Nuevo Cliente
</button>
  </div>

  <app-table [columns]="clientColumns" [data]="tableData" [pageSize]="pageSize" [currentPage]="currentPage"
    [totalItems]="totalRegisters" [actionsTemplate]="actionsTemplate" (pageChange)="onPageChange($event)"
    (sortChange)="onSortChange($event)">
    <ng-template #actionsTemplate let-item>
      <div class="flex items-center space-x-2">
        <button (click)="viewClient(item)" class="text-blue-600 hover:text-blue-900 text-sm cursor-pointer">
          <i class="fas fa-eye"></i>
        </button>
        <button (click)="editClient(item)" class="text-green-600 hover:text-green-900 text-sm cursor-pointer">
          <i class="fas fa-edit"></i>
        </button>
        <button (click)="deleteClient(item)" class="text-red-600 hover:text-red-900 text-sm cursor-pointer">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </ng-template>
  </app-table>
</div>

   <!-- <button class="text-red-600" (click)="dialogOpen.set(true)">Eliminar</button>
   <app-pop-up [open]="dialogOpen">
      <h3 class="mb-5 text-lg text-gray-500">
        ¿Seguro que querés eliminar el producto?
      </h3>

      <button class="px-5 py-2.5 bg-red-600 text-white rounded-lg me-3"
              (click)="onConfirm()">Sí, eliminar</button>

      <button class="px-5 py-2.5 border rounded-lg"
              (click)="dialogOpen.set(false)">Cancelar</button>
    </app-pop-up> -->
`
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



// http://localhost:8080/api/v1/Empresa/usuario/4




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
    console.log('Eliminar cliente:', client.id);
  }

  viewClient(client: IPerson): void {
    console.log('Ver detalles de cliente:', client);
  }
}
