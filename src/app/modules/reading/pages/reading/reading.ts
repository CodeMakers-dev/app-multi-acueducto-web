import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Header } from "@components/header/header";
import { Navigation } from "@components/navigation/navigation";
import { Table } from '@components/table/table';
import { Footer } from "@components/footer/footer";
import { TableColumn } from '@interfaces/ItableColumn';
import { ILectura } from '@interfaces/Ifactura';
import { LecturaService } from '../../service/lectura.service';
import { ToastService } from '@services/toast.service';
import { ApiResponse } from '@interfaces/Iresponse';

@Component({
  selector: 'app-reading',
  imports: [Header, CommonModule, Table, RouterModule, Navigation, Footer],
  templateUrl: './reading.html',
 
})
export class Reading implements OnInit {



  readingColumns: TableColumn[] = [
  { key: 'contador.serial', label: 'N°. serial (contador)', sortable: true },
  { key: 'lectura', label: 'N°. Lectura (m³)', sortable: true },
  { key: 'fechaLectura', label: 'Fecha lectura', sortable: true },
  { key: 'consumoAnormal', label: 'Consumo anormal', sortable: false },
  { key: 'descripcion', label: 'Observación', sortable: true },
];

  tableData: ILectura[] = [];
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly lecturaService = inject(LecturaService);

  protected readonly router = inject(Router);

  protected readonly toastService = inject(ToastService);


  ngOnInit(): void {
    this.loadLecturas();
  }

 loadLecturas(): void {
  this.lecturaService.getAllLectura(
    this.currentPage,
    this.pageSize,
    this.searchTerm,
    this.currentSortColumn,
    this.currentSortDirection
  ).subscribe(
    (apiResponse: ApiResponse<ILectura[]>) => {
      this.tableData = apiResponse.response.map(lectura => ({
        ...lectura,
        fechaLectura: lectura.fechaLectura?.toString().slice(0, 10),
        consumoAnormal: lectura.consumoAnormal ? 'SI' : 'NO'
      }));

      this.totalRegisters = this.tableData.length;
    },
    error => {
      console.error('Error al cargar las lecturas:', error);
    }
  );
}


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadLecturas();
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.currentSortColumn = event.column;
    this.currentSortDirection = event.direction;
    this.loadLecturas();
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadLecturas();
  }
  
}
