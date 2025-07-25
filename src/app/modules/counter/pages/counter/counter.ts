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

  idDef: string | null = localStorage.getItem('enterpriseId');
  // counterColumns = signal(['serial', 'tipoContador', 'direccion','cliente', 'cedula']);
    counterColumns = signal([
  { field: 'serial', header: 'Serial' },
  { field: 'tipoContador', header: 'Tipo Contador' },
  { field: 'direccion', header: 'Direccion' },
  { field: 'cliente', header: 'Cliente' },
  { field: 'cedula', header: 'Cedula' }
]);
  counterData = computed(() => this.dataEnterpriseClientCounter.value() ?? []);


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