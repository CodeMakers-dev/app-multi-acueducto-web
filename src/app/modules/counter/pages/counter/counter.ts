import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Table } from '@components/table/table';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { TableColumn } from '@interfaces/ItableColumn';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { CorreoPersonaService } from '../../../client/service/correoPersona.service';
import { TelefonoPersonaService } from '../../../client/service/telefonoPersona.service';

@Component({
  selector: 'app-counter',
  imports: [CommonModule, Table, RouterModule],
  template: `
  <div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestión de Contadores</h1>

  <div class="mb-4">
    <input
      type="text"
      placeholder="Buscar..."
      class="border p-2 rounded-md w-1/3"
      (input)="onSearchInput($event)"
    />
  </div>

  <app-table
    [columns]="contadorColumns"
    [data]="tableData"
    [pageSize]="pageSize"
    [currentPage]="currentPage"
    [totalItems]="totalRegisters"
    [actionsTemplate]="actionsTemplate"
    (pageChange)="onPageChange($event)"
    (sortChange)="onSortChange($event)"
  >
    <ng-template #actionsTemplate let-item>
      <div class="flex items-center space-x-2">
        <button [routerLink]="['/counter/actualizar-contador', item.id]" class="text-green-600 hover:text-green-900 text-sm cursor-pointer">
          <i class="fas fa-edit"></i>
        </button>
        <button (click)="deleteContador(item)" class="text-red-600 hover:text-red-900 text-sm cursor-pointer">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </ng-template>
  </app-table>
  </div>
  `,
  styleUrl: './counter.css'
})
export class Counter implements OnInit {
  

  

  contadorColumns: TableColumn[] = [
    { key: 'contador.tipoContador.nombre', label: 'Tipo de Contador', sortable: true },
    { key: 'contador.descripcion.descripcion', label: 'Dirección', sortable: true },
    { key: 'contador.serial', label: 'Número Serial', sortable: true },
    { key: 'clienteNombreCompleto', label: 'Nombre del Cliente', sortable: false },
    { key: 'cliente.numeroCedula', label: 'Cédula del Cliente', sortable: true }
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
  protected readonly router = inject(Router);

  ngOnInit(): void {
    const idEmpresa = 5;
    this.loadCountersByEnterprise(idEmpresa);
  }

  loadCountersByEnterprise(idEmpresa: number): void {
    this.enterpriseClientCounterService.getAllCounterByIdEnterprise(idEmpresa).subscribe(
      (apiResponse: ApiResponse<IEnterpriseClientCounter[]>) => {
        const counters = apiResponse.response;
        this.totalRegisters = counters.length;

        console.log('Contadores obtenidos:', counters);

        this.correoService.getAllCorreo().subscribe(correosResp => {
          const correos = correosResp.response;

          this.telefonoService.getAllTelefono().subscribe(telefonosResp => {
            const telefonos = telefonosResp.response;
            counters.forEach(counter => {
              const personaId = counter.cliente?.id;
              const correosPersona = correos.filter(c => c.persona.id === personaId);
              const telefonosPersona = telefonos.filter(t => t.persona.id === personaId);
              counter.cliente.correo = correosPersona;
              counter.cliente.telefono = telefonosPersona;
              (counter as any).correoPrincipal = correosPersona[0]?.correo || 'Sin correo';
              (counter as any).telefonoPrincipal = telefonosPersona[0]?.numero || 'Sin teléfono';
            });
            this.tableData = counters.map(counter => ({
            ...counter,
            clienteNombreCompleto: `${counter.cliente?.nombre || ''} ${counter.cliente?.apellido || ''} ${counter.cliente.segundoApellido || ''}`.trim()
          }));
        });
      });
    },
      error => {
        console.error('Error al cargar contadores por empresa:', error);
      }
    );
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadCountersByEnterprise(1);
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.currentSortColumn = event.column;
    this.currentSortDirection = event.direction;
    this.loadCountersByEnterprise(1);
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadCountersByEnterprise(1);
  }

  viewContador(counter: IEnterpriseClientCounter): void {
    console.log('Ver detalles del contador:', counter);
  }

  editContador(counter: IEnterpriseClientCounter): void {
    if (counter.id) {
      console.log('Editar contador:', counter.id);
      this.router.navigate([`/actualizar-contador`, counter.id]);
    }
  }

  deleteContador(counter: IEnterpriseClientCounter): void {
    console.log('Eliminar contador:', counter?.contador?.id);
  }
}