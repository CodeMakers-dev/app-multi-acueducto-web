import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { TableComponent } from '@components/table';
import { Action } from '@components/table';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { ApiResponse } from '@interfaces/Iresponse';

@Component({
  selector: 'app-counter',
  imports: [CommonModule, RouterModule, TableComponent],
  template: `
  <div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestión de Contadores</h1>

    <ng-template #toggleTpl let-row>
      <a (click)="editar(row)" class="text-green-600 hover:text-green-900 text-sm cursor-pointer">
        <i class="fas fa-edit"></i>
      </a>
    </ng-template>

    <app-table-dynamic
      [datasource]="counterData()"
      [columns]="counterColumns()" 
      [actionTemplate]="toggleTpl"
      />
      
  </div>
  `
})
export class Counter {
  

  enterpriseId = signal<number | undefined>(
    Number(localStorage.getItem('enterpriseId')) || undefined
  );


  
  
   contadorColumns = signal([
     'tipoContador',
    'direccion',
     'serial',
     'clienteNombreCompleto',
     'correoPrincipal',
    'telefonoPrincipal'
   ]);
   title = 'Contadores';
  totalRegisters = 0;

  tableData: any[] = [];

  constructor(
    private enterpriseClientCounterService: EnterpriseClientCounterService,
     private correoService: CorreoPersonaService,
     private telefonoService: TelefonoPersonaService
  ) {}

  ngOnInit(): void {
     const idEmpresa = 5;
    this.loadCountersByEnterprise(idEmpresa);
  }

   loadCountersByEnterprise(idEmpresa: number): void {
     this.enterpriseClientCounterService
       .getAllCounterByIdEnterprise(idEmpresa)
      .subscribe({
        next: (apiResponse) => {
           const counters = apiResponse.response;
           this.totalRegisters = counters.length;

           this.correoService.getAllTypeDocument().subscribe(correosResp => {
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
                 clienteNombreCompleto: `${counter.cliente?.nombre || ''} ${counter.cliente?.apellido || ''} ${counter.cliente?.segundoApellido || ''}`.trim()
               }));
             });
          });
        },
      error: err => {
          console.error('Error al cargar contadores por empresa:', err);
         }
       });
  }

  handleTableAction(event: Action<any>) {
  const row = event.row;
   if (event.action === 'edit') {
     this.contador = { ...row };
   }
 }

  idDef: string | null = localStorage.getItem('enterpriseId');
  counterColumns = signal(['serial', 'tipoContador', 'direccion','cliente', 'cedula']);
  counterData = computed(() => this.dataEnterpriseClientCounter.value() ?? []);
  title = 'Clientes';

  private readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  private readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  constructor() {
    
    const enterpriseId = localStorage.getItem('enterpriseId');
    console.log('ID de la empresa:', enterpriseId);

    effect(() => {
      console.log('Data loaded______:', this.dataEnterpriseClientCounter.value());
    })
  }

dataEnterpriseClientCounter = rxResource({
  stream: () => {
    const id = this.enterpriseId();
    if (!id) {
      throw new Error('Enterprise ID is required');
    }
    return this.enterpriseClientCounterService.getAllCounterByIdEnterprise(id).pipe(
      map(data => data.response.map(item => ({
        id: item.id,
        serial:item.contador.serial,
        tipoContador: item.contador.tipoContador.nombre,
        cliente: [
          item.contador.cliente?.nombre || '',
          item.contador.cliente?.segundoNombre || '',
          item.contador.cliente?.apellido || '',
          item.contador.cliente?.segundoApellido || '']
          .filter(name => name.trim() !== '').join(' '),
        cedula: item.contador.cliente.numeroCedula,
        direccion: item.contador.descripcion.descripcion
      })))
    );
  }
});

editar(row: any ) {
    this.router.navigate(['/counter/actualizar-contador', row.id], { relativeTo: this.route });
    console.log('Editar contador con ID:', row.id);
  }


}