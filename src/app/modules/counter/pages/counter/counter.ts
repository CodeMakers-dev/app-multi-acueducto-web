import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { TableComponent } from '@components/table';
import { Action } from '@components/table';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-counter',
  imports: [CommonModule, RouterModule, TableComponent],
  template: `
  <div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestión de Contadores</h1>

  <!-- <app-table-dynamic
  [title]="title"
  [columns]="contadorColumns()"
  [datasource]="tableData"
  [actionTemplate]="actionTpl"
  [showAddButton]="true"
  [addButtonText]="'Agregar Contador'"
  (action)="handleTableAction($event)"
></app-table-dynamic> -->


  </div>
  `,
  styleUrl: './counter.css'
})
export class Counter {

  idDef: string | null = localStorage.getItem('enterpriseId');

  constructor() {
    const enterpriseId = localStorage.getItem('enterpriseId');
    console.log('ID de la empresa:', enterpriseId);
    console.log('dataEnterpriseClientCounter---------------------------', this.dataEnterpriseClientCounter.value());
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

  private readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);

  dataEnterpriseClientCounter = rxResource({
    stream: () => this.enterpriseClientCounterService.getAllCounterByIdEnterprise(5),
  });

  onToggle(row: any) {
    row.activo = !row.activo;
  }

  handleTableAction(event: Action) {
    alert(`Action: ${event.action} on row: ${JSON.stringify(event.row)}`);
  }
  
//   contadorColumns = signal([
//     'tipoContador',
//     'direccion',
//     'serial',
//     'clienteNombreCompleto',
//     'correoPrincipal',
//     'telefonoPrincipal'
//   ]);
//   title = 'Contadores';
//   totalRegisters = 0;

//   tableData: any[] = [];

//   constructor(
//     private enterpriseClientCounterService: EnterpriseClientCounterService,
//     private correoService: CorreoPersonaService,
//     private telefonoService: TelefonoPersonaService
//   ) {}

//   ngOnInit(): void {
//     const idEmpresa = 5;
//     this.loadCountersByEnterprise(idEmpresa);
//   }

//   loadCountersByEnterprise(idEmpresa: number): void {
//     this.enterpriseClientCounterService
//       .getAllCounterByIdEnterprise(idEmpresa)
//       .subscribe({
//         next: (apiResponse) => {
//           const counters = apiResponse.response;
//           this.totalRegisters = counters.length;

//           this.correoService.getAllTypeDocument().subscribe(correosResp => {
//             const correos = correosResp.response;

//             this.telefonoService.getAllTelefono().subscribe(telefonosResp => {
//               const telefonos = telefonosResp.response;

//               counters.forEach(counter => {
//                 const personaId = counter.cliente?.id;
//                 const correosPersona = correos.filter(c => c.persona.id === personaId);
//                 const telefonosPersona = telefonos.filter(t => t.persona.id === personaId);

//                 counter.cliente.correo = correosPersona;
//                 counter.cliente.telefono = telefonosPersona;

//                 (counter as any).correoPrincipal = correosPersona[0]?.correo || 'Sin correo';
//                 (counter as any).telefonoPrincipal = telefonosPersona[0]?.numero || 'Sin teléfono';
//               });

//               this.tableData = counters.map(counter => ({
//                 ...counter,
//                 clienteNombreCompleto: `${counter.cliente?.nombre || ''} ${counter.cliente?.apellido || ''} ${counter.cliente?.segundoApellido || ''}`.trim()
//               }));
//             });
//           });
//         },
//         error: err => {
//           console.error('Error al cargar contadores por empresa:', err);
//         }
//       });
//   }

//   handleTableAction(event: Action<any>) {
//   const row = event.row;
//   if (event.action === 'edit') {
//     this.contador = { ...row };
//   }
// }
}