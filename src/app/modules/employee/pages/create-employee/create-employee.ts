import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICity } from '@interfaces/Icity';
import { ICorregimiento } from '@interfaces/Icorregimiento';
import { ApiResponse } from '@interfaces/Iresponse';
import { DepartamentService } from '../../../auth/service/departament.service';
import { CityService } from '../../../auth/service/city.service';
import { CorregimientoService } from '../../../auth/service/corregimiento.service';
import { TypeDocumentService } from '../../../client/service/typeDocument.service';
import { IDepartament } from '@interfaces/Idepartament';
import { ITipoDocumento } from '@interfaces/Iuser';
import { EmpleadoService } from '../../service/empleado.service';
import { IEmpleadoEmpresaRequest, IEmpleadoResponse } from '@interfaces/Iemployee';
import { ToastService } from '@services/toast.service';
import { Router } from '@angular/router';
import { UserService } from '../../../auth/service/user.service';

@Component({
  selector: 'app-create-employee',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-employee.html',
})
export class CreateEmployee implements OnInit {
  registerForm!: FormGroup;

  departaments: IDepartament[] = [];
  cities: ICity[] = [];
  corregimientos: ICorregimiento[] = [];
  typeDocument: ITipoDocumento[] = [];
  typeDocumentName: string[] = [];

  selectedDepartamentId: number | null = null;
  selectCitiesId: number | null = null;
  selectCorregimientoId: number | null = null;
  selectedTipoDocumentoId: number | null = null;

  filteredCities: ICity[] = [];
  filteredCorregimientos: ICorregimiento[] = [];

  protected readonly departamentService = inject(DepartamentService);
  protected readonly fb = inject(FormBuilder);
  protected readonly cityService = inject(CityService);
  protected readonly corregimientoService = inject(CorregimientoService);
  protected readonly tipoDocumentoService = inject(TypeDocumentService);
  protected readonly empleadoService = inject(EmpleadoService);
  protected readonly toast = inject(ToastService);
  protected readonly router = inject(Router);
  protected readonly userService = inject(UserService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadDepartamentData();
    this.loadAllCities();
    this.loadAllCorregimiento();
    this.loadTypeDocument();

    this.registerForm
      .get('idDepartamento')
      ?.valueChanges.subscribe((departamentoId) => {
        console.log('valueChanges idDepartamento:', departamentoId);
        this.selectedDepartamentId = departamentoId;
        this.onDepartamentChange();
      });

    this.registerForm.get('idCiudad')?.valueChanges.subscribe(() => {
      this.onCitiesChange();
    });
  }
  private initializeForm(): void {
  const usuarioCreacion = localStorage.getItem('nameUser') || 'admin';
  const idEmpresa = localStorage.getItem('enterpriseId')
    ? +localStorage.getItem('enterpriseId')!
    : null;

  this.registerForm = this.fb.group({
    tipoDocumento: [null, Validators.required],
    numeroDocumento: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    primerApellido: ['', Validators.required],
    segundoApellido: [''],
    primerNombre: ['', Validators.required],
    segundoNombre: [''],
    idDepartamento: [null, Validators.required],
    idCiudad: [null, Validators.required],
    idCorregimiento: [null],
    direccion: [''],
    telefono: ['', Validators.required],
    codigo: ['', Validators.required],
    usuario_creacion: [usuarioCreacion],
    id_empresa: [idEmpresa, Validators.required]
  });
}
  loadTypeDocument(): void {
    this.tipoDocumentoService.getAllTypeDocument().subscribe((response) => {
      console.log('Tipos de documento:', response.response);
      this.typeDocument = response.response;
      this.typeDocumentName = response.response.map((tipoDocumento) => tipoDocumento.nombre)
    })
  }
  loadDepartamentData(): void {
    this.departamentService.getAllDepartaments().subscribe((response) => {
      console.log('Departamentos:', response.response);
      this.departaments = response.response;
    });
  }

  loadAllCities(): void {
    this.cityService.getAllCitys().subscribe({
      next: (resp: ApiResponse<ICity[]>) => {
        if (resp.success) {
          this.cities = resp.response;
          console.log('Ciudades cargados:', this.cities);
        } else {
          console.error('Error al cargar ciudades:', resp.message);
        }
      },
      error: (err) => {
        console.error('Error de red al cargar ciudades:', err);
      }
    });
  }

  loadAllCorregimiento(): void {
    this.corregimientoService.getAllCorregimientos().subscribe({
      next: (resp: ApiResponse<ICorregimiento[]>) => {
        if (resp.success) {
          this.corregimientos = resp.response;
          console.log('Corregimientos cargados:', this.corregimientos);
        } else {
          console.error('Error al cargar corregimientos:', resp.message);
        }
      },
      error: (err) => {
        console.error('Error de red al cargar corregimientos:', err);
      }
    });
  }

  onDepartamentChange(): void {
    console.log('selectedDepartamentId:', this.selectedDepartamentId);
    console.log(
      'departamentoId de cada ciudad:',
      this.cities.map((c) => c.departamento?.id)
    );
    this.selectCitiesId = null;
    this.selectCorregimientoId = null;
    this.filteredCorregimientos = [];

    if (this.selectedDepartamentId) {
      this.filteredCities = this.cities.filter(
        (cyt) =>
          cyt.departamento &&
          Number(cyt.departamento.id) === Number(this.selectedDepartamentId)
      );
      console.log('filteredCities:', this.filteredCities);
    } else {
      this.filteredCities = [];
    }
  }

  onCitiesChange(): void {
    const selectedCityId = this.registerForm.get('idCiudad')?.value;
    this.selectCorregimientoId = null;

    if (selectedCityId) {
      this.filteredCorregimientos = this.corregimientos.filter(
        (cor) => cor.ciudad && String(cor.ciudad.id) === String(selectedCityId)
      );
      console.log('filteredCorregimientos:', this.filteredCorregimientos);
    } else {
      this.filteredCorregimientos = [];
      console.log('filteredCorregimientos: []');
    }
  }
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.warning('Formulario inválido', 'Por favor complete todos los campos correctamente.');
      return;
    }

    const formValue = this.registerForm.value;

    const payload: IEmpleadoEmpresaRequest = {
      id_tipo_documento: formValue.tipoDocumento,
      numero_cedula: formValue.numeroDocumento,
      codigo: formValue.codigo,
      primer_nombre: formValue.primerNombre,
      segundo_nombre: formValue.segundoNombre,
      primer_apellido: formValue.primerApellido,
      segundo_apellido: formValue.segundoApellido,
      id_departamento: formValue.idDepartamento,
      id_ciudad: formValue.idCiudad,
      id_corregimiento: formValue.idCorregimiento,
      descripcion_direccion: formValue.direccion,
      correo: formValue.correo,
      telefono: formValue.telefono,
      usuario_creacion: formValue.usuario_creacion,
      id_empresa: formValue.id_empresa
    };

    console.log('📤 Payload a enviar:', payload);

    this.empleadoService.saveEmpleado(payload).subscribe({
      next: (res) => {
        console.log('✅ Empleado guardado correctamente:', res);
        this.toast.success('Éxito', 'El empleado se registró correctamente.');

        const personaDTO = {
          id: (res as any).id_persona,
          nombre: (res as any).primer_nombre,
          segundoNombre: (res as any).segundo_nombre,
          apellido: (res as any).primer_apellido,
          segundoApellido: (res as any).segundo_apellido,
          numeroCedula: (res as any).numero_cedula,
          activo: true
        };
        this.userService.sendEmailUsuario(personaDTO).subscribe({
          next: (response) => {
            if (response.success) {
              this.toast.success('Correo enviado', 'Se ha enviado el correo al usuario.');
            } else {
              this.toast.warning('Advertencia', 'Empleado creado, pero el correo no se pudo enviar.');
            }
          },
          error: (err) => {
            console.error('Error al enviar correo:', err);
            this.toast.error('Error al enviar el correo', 'Intente nuevamente o contacte a soporte.');
          }
        });

        this.router.navigate(['/employee']);
      },
      error: (err) => {
        console.error(' Error al guardar el empleado:', err);
        this.toast.error('Error al guardar', 'No se pudo registrar el empleado. Intente más tarde.');
      }
    });
  }


}

