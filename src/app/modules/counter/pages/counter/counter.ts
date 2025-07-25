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
  }

}