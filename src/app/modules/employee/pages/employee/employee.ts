import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  Action,
  TableComponent,
} from '../../../../../app/core/components/table';
import { rxResource } from '@angular/core/rxjs-interop';
import { EmpleadoService } from '../../service/empleado.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, TableComponent, RouterModule],
  template: `
    <ng-template #toggleTpl let-row>
             <a (click)="editar(row)" class="text-green-600 hover:text-green-900 text-sm cursor-pointer">
                    <i class="fas fa-edit"></i>
                </a>
    </ng-template>
    <app-table-dynamic
      [title]="title"
      [columns]="employeeColumns()"
      [datasource]="employeeData()"
      [actionTemplate]="toggleTpl"
      [showAddButton]="true"
      [addButtonText]="'Agregar Empleado'"
      (action)="handleTableAction($event)"
    />
  `,
})
export class Employee {

  employeeColumns = signal(['personaNombreCompleto', 'numeroCedula', 'codigo', 'telefono', 'correoElectronico', 'activo']);
  employeeData = computed(() => this.dataEmployeeCounter.value() ?? []);
  title = 'Empleados';


  protected readonly empleadoService = inject(EmpleadoService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);


  dataEmployeeCounter = rxResource({
    stream: () => this.empleadoService.getAllDatosEmpleadoCompleto().pipe(
      map(data => {
        return data.empleados.response.map(emp => ({
          ...emp,
          correoElectronico: data.correos.response.find(c => c.persona.id === emp.personaId)?.correo ?? '',
          telefono: data.telefonos.response.find(t => t.persona.id === emp.personaId)?.numero ?? ''
        }));
      })
    ),
  });


  onToggle(row: any) {
    row.activo = !row.activo;
  }

  editar(row: any ) {
    this.router.navigate(['/employee/update-employee/', row.id], { relativeTo: this.route });
  }

 handleTableAction(event: Action) {
    console.log('Action received:', event);
    if (event.action === 'add') {
      this.router.navigate(['/employee/create-employee'], { relativeTo: this.route });
    }
  }

}

