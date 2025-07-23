import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Table } from '@components/table/table';
import { IEmpleadoEmpresaResponse } from '@interfaces/Iemployee';
import { TableColumn } from '@interfaces/ItableColumn';
import { EmpleadoService } from '../../service/empleado.service';
import { ToastService } from '@services/toast.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { CorreoPersonaService } from '../../../client/service/correoPersona.service';
import { TelefonoPersonaService } from '../../../client/service/telefonoPersona.service';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, Table, RouterModule],
  templateUrl: './employee.html',
})
export class Employee implements OnInit {

  employeeColumns: TableColumn[] = [
    { key: 'personaNombreCompleto', label: 'Nombre de empleado', sortable: true },
    { key: 'numeroCedula', label: 'N°. Identificacion', sortable: true },
    { key: 'codigo', label: 'Codigo', sortable: true },
    { key: 'correoPrincipal', label: 'Correo', sortable: true },
    { key: 'telefonoPrincipal', label: 'Telefono', sortable: true },
    { key: 'activo', label: 'Estado', sortable: true },
  ];

  tableData: IEmpleadoEmpresaResponse[] = [];
  totalRegisters: number = 0;

  currentPage: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';
  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';

  protected readonly empleadoService = inject(EmpleadoService);
  protected readonly correoService = inject(CorreoPersonaService);
  protected readonly telefonoService = inject(TelefonoPersonaService);
  protected readonly router = inject(Router);
  protected readonly toastService = inject(ToastService);


  ngOnInit(): void {
    this.loadEmpleado();
  }

  loadEmpleado(): void {
    this.empleadoService.getAllEmpleado(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.currentSortColumn,
      this.currentSortDirection
    ).subscribe(
      (apiResponse: ApiResponse<IEmpleadoEmpresaResponse[]>) => {
        const empleados = apiResponse.response;
        this.totalRegisters = empleados.length;

        this.correoService.getAllTypeDocument().subscribe(correosResp => {
          const correos = correosResp.response;

          this.telefonoService.getAllTelefono().subscribe(telefonosResp => {
            const telefonos = telefonosResp.response;

            empleados.forEach(empleado => {
              const personaId = empleado.personaId;

              const correosPersona = correos.filter(c => c.persona.id === personaId);
              const telefonosPersona = telefonos.filter(t => t.persona.id === personaId);

              (empleado as any).correoPrincipal = correosPersona[0]?.correo || 'Sin correo';
              (empleado as any).telefonoPrincipal = telefonosPersona[0]?.numero || 'Sin teléfono';
              (empleado as any).activo = empleado.activo ? 'Activo' : 'Inactivo';
            });

            this.tableData = empleados;
          });
        });
      },
      error => {
        console.error('Error al cargar los empleados:', error);
      }
    );
  }



  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadEmpleado();
  }

  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    this.currentSortColumn = event.column;
    this.currentSortDirection = event.direction;
    this.loadEmpleado();
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadEmpleado();
  }
}
