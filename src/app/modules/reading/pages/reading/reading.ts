import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ILectura } from '@interfaces/Ifactura';
import { ReadingService } from '../../service/reading.service';
import { ToastService } from '@services/toast.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { TableComponent } from '@components/table';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-reading',
  imports: [CommonModule, TableComponent, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Gestión de Lecturas</h1>

    <ng-template #toggleTpl let-row>
        <a (click)="edit(row)" class="text-green-600 hover:text-green-900 text-sm cursor-pointer">
            <i class="fas fa-edit"></i>
        </a>
    </ng-template>

    <app-table-dynamic
        [datasource]="readingData()"
        [columns]="readingColumns()"
        [actionTemplate]="toggleTpl"
    />
      
</div>

  `
})
export class Reading {

  readingColumns = signal([
    { field: 'serial', header: 'Serial' },
    { field: 'lectura', header: 'Lectura' },
    { field: 'fechaLectura', header: 'Fecha Lectura' },
    { field: 'consumoAnormal', header: 'Consumo Anormal' },
    { field: 'observacion', header: 'Observación' },
  ]);

  readingData = computed(() => {
    const arr = this.dataReading.value() ?? [];
    return [...arr].sort((a, b) => a.id - b.id);
  });

  protected readonly readingService = inject(ReadingService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly toastService = inject(ToastService);

  constructor() {
    effect(() => {
      console.log('Data reading-------------->:', this.readingData());
    })
  }

  dataReading = rxResource({
    stream: () =>
      this.readingService.getAllReading()
      .pipe(
        map((rawData) => {
          const response = rawData as ApiResponse<ILectura[]>;
          const arr = Array.isArray(response.response)
            ? response.response
            : [response.response];

          return arr.map(item => ({
            id: item.id,
            serial: item.contador.serial,
            lectura: item.lectura,
            fechaLectura: new Date(item.fechaLectura)
            .toLocaleString('es-CO', {
              year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }),
            consumoAnormal: item.consumoAnormal ? 'Sí' : 'No',
            observacion: item.descripcion ?? ''
          }));
        })
      )
  });

  edit(row: any) {
    this.router.navigate(['/reading/update-reading/', row.id], {
      relativeTo: this.route,
    });
    console.log('Editar contador con ID:', row.id);
  }

}
