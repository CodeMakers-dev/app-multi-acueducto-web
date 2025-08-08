import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICity } from '@interfaces/Icity';
import { ICorregimiento } from '@interfaces/Icorregimiento';
import { IDepartament } from '@interfaces/Idepartament';
import { ITypeCounter } from '@interfaces/ItypeCounter';
import { DepartamentService } from '../../../auth/service/departament.service';
import { CityService } from '../../../auth/service/city.service';
import { CorregimientoService } from '../../../auth/service/corregimiento.service';
import { TypeCounterService } from '../../service/typeCounter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@interfaces/Iresponse';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { AuthService } from '../../../auth/service/auth.service';
import { ToastService } from '@services/toast.service';
import { UserService } from '../../../auth/service/user.service';

@Component({
  selector: 'app-create-counter',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-counter.html',
})
export class CreateCounter implements OnInit {
  registerForm!: FormGroup;
  personaData: any;

  departaments: IDepartament[] = [];
  cities: ICity[] = [];
  corregimientos: ICorregimiento[] = [];
  tipoContador: ITypeCounter[] = [];
  tipoContadorName: string[] = [];

  selectedDepartamentId: number | null = null;
  selectCitiesId: number | null = null;
  selectCorregimientoId: number | null = null;
  selectedTipoContadorId: number | null = null;

  filteredCities: ICity[] = [];
  filteredCorregimientos: ICorregimiento[] = [];

  protected readonly departamentService = inject(DepartamentService);
  protected readonly fb = inject(FormBuilder);
  protected readonly cityService = inject(CityService);
  protected readonly corregimientoService = inject(CorregimientoService);
  protected readonly tipoContadorService = inject(TypeCounterService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  protected readonly authService = inject(AuthService);
  protected readonly toast = inject(ToastService);
  protected readonly userService = inject(UserService);

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.personaData = nav?.extras?.state?.['personaData'];

    if (!this.personaData) {
    const saved = sessionStorage.getItem('personaData');
    this.personaData = saved ? JSON.parse(saved) : null;
  }

    if (!this.personaData) {
      alert('No se encontraron datos del cliente. Regresando al formulario anterior.');
      this.router.navigate(['/client/create-client']);
      return;
    }

    this.initializeForm();
    this.loadDepartamentData();
    this.loadAllCities();
    this.loadAllCorregimiento();
    this.loadTypeCounter();

    this.registerForm
      .get('idDepartamento')
      ?.valueChanges.subscribe((departamentoId) => {
        this.selectedDepartamentId = departamentoId;
        this.onDepartamentChange();
      });

    this.registerForm.get('idCiudad')?.valueChanges.subscribe(() => {
      this.onCitiesChange();
    });
  }
  private initializeForm(): void {
    this.registerForm = this.fb.group({
      tipoContador: [null, Validators.required],
      serial: ['', Validators.required],
      idDepartamento: [null, Validators.required],
      idCiudad: [null, Validators.required],
      idCorregimiento: [null],
      direccion: [''],
    });
  }
  loadTypeCounter(): void {
    this.tipoContadorService.getAllTypeCounters().subscribe((response) => {
      console.log('Tipos de documento:', response.response);
      this.tipoContador = response.response;
      this.tipoContadorName = response.response.map((tipoDocumento) => tipoDocumento.nombre)
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

  saveClient() {
  if (this.registerForm.valid && this.personaData) {
    const contadorData = this.registerForm.value;

    const idEmpresa = this.authService.getEnterpriseId();
    const usuario = this.authService.getUser();
    const nombreUsuario = usuario?.nombre || 'sin_usuario';

    if (!idEmpresa || !usuario) {
      this.toast.error('No se pudo obtener la información del usuario logueado', 'Error');
      return;
    }

    const finalPayload = {
      id_tipo_documento: this.personaData.tipoDocumento,
      numero_cedula: this.personaData.numeroDocumento,
      correo: this.personaData.correo,
      primer_nombre: this.personaData.primerNombre,
      segundo_nombre: this.personaData.segundoNombre,
      primer_apellido: this.personaData.primerApellido,
      segundo_apellido: this.personaData.segundoApellido,
      id_departamento: this.personaData.idDepartamento,
      id_ciudad: this.personaData.idCiudad,
      id_corregimiento: this.personaData.idCorregimiento,
      telefono: this.personaData.telefono,
      descripcion_direccion: this.personaData.direccion,

      id_empresa: idEmpresa,
      usuario_creacion: nombreUsuario,

      id_tipo_contador: contadorData.tipoContador,
      serial_contador: contadorData.serial,

      direccion_contador: {
        id_departamento: contadorData.idDepartamento,
        id_ciudad: contadorData.idCiudad,
        id_corregimiento: contadorData.idCorregimiento,
        descripcion_direccion: contadorData.direccion
      }
    };

    this.enterpriseClientCounterService.saveClient(finalPayload).subscribe({
      next: (resp) => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          sessionStorage.removeItem('personaData');
          this.toast.success('Cliente y contador guardados correctamente', 'Éxito');

          const personaDTO = {
            id: resp.id_persona || null,
            nombre: this.personaData.primerNombre,
            segundoNombre: this.personaData.segundoNombre,
            apellido: this.personaData.primerApellido,
            segundoApellido: this.personaData.segundoApellido,
            numeroCedula: this.personaData.numeroDocumento,
            activo: true
          };

          this.userService.sendEmailUsuario(personaDTO).subscribe({
            next: (response) => {
              if (response.success) {
                this.toast.success('Correo enviado', 'Se ha enviado el correo al usuario.');
              } else {
                this.toast.warning('Advertencia', 'Cliente creado, pero el correo no se pudo enviar.');
              }
            },
            error: (err) => {
              console.error('Error al enviar correo:', err);
              this.toast.error('Error al enviar el correo', 'Intente nuevamente o contacte a soporte.');
            }
          });

          this.router.navigate(['/client']);
        } else {
          this.toast.warning(`Error al guardar: ${resp.message || 'Desconocido'}`, 'Advertencia');
        }
      },
      error: (err) => {
        console.error('Error en la petición', err);
        this.toast.error('Ocurrió un error al guardar los datos', 'Error');
      }
    });
  } else {
    this.toast.warning('Completa todos los campos antes de guardar', 'Formulario incompleto');
    this.registerForm.markAllAsTouched();
  }
}

}
