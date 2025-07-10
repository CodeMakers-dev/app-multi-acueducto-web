import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DepartamentService } from '../../service/departament.service';
import { IDepartament } from '@interfaces/Idepartament';
import { CityService } from '../../service/city.service';
import { CorregimientoService } from '../../service/corregimiento.service';
import { EnterpriseService } from '../../service/enterprise.service';
import { ICity } from '../../../../../app/core/interfaces/Icity';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@interfaces/Iresponse';
import Swal from 'sweetalert2';
import { ICorregimiento } from '@interfaces/Icorregimiento';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isLoading: boolean = false;

  departaments: IDepartament[] = [];
  cities: ICity[] = [];
  corregimientos: ICorregimiento[] = [];

  selectedDepartamentId: number | null = null;
  selectCitiesId: number | null = null;
  selectCorregimientoId: number | null = null;

  filteredCities: ICity[] = [];
  filteredCorregimientos: ICorregimiento[] = [];

  showPassword: boolean = false;

  protected readonly router = inject(Router);
  protected readonly fb = inject(FormBuilder);
  protected readonly departamentService = inject(DepartamentService);
  protected readonly cityService = inject(CityService);
  protected readonly corregimientoService = inject(CorregimientoService);
  protected readonly enterpriseService = inject(EnterpriseService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadDepartamentData();
    this.loadAllCities();
    this.loadAllCorregimiento();

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
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombreEmpresa: ['', [Validators.required, Validators.minLength(2)]],
      idDepartamento: ['', [Validators.required]],
      idCiudad: ['', [Validators.required]],
      idCorregimiento: [''],
      descripcionDireccion: [''],
      nit: ['', [Validators.required]],
      codigoEmpresa: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loadDepartamentData(): void {
    this.departamentService.getAllDepartaments().subscribe((response) => {
      this.departaments = response.response;
    });
  }

  loadAllCities(): void {
    this.cityService.getAllCitys().subscribe({
    next: (resp: ApiResponse<ICity[]>)  => {
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
    next: (resp: ApiResponse<ICorregimiento[]>)  => {
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
    if (this.registerForm.valid) {
      this.isLoading = true;

      const formData = this.registerForm.value;

      const empresaData = {
        usuario: formData.usuario,
        password: formData.password,
        nombreEmpresa: formData.nombreEmpresa,
        nit: formData.nit,
        codigoEmpresa: formData.codigoEmpresa,
        idDepartamento: formData.idDepartamento,
        idCiudad: formData.idCiudad,
        idCorregimiento: formData.idCorregimiento || null,
        descripcionDireccion: formData.descripcionDireccion || null,
      };

      console.log('Datos a enviar para registrar empresa:', empresaData);

      this.enterpriseService.registerEnterprise(empresaData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro de empresa exitoso:', response);
          Swal.fire({
            icon: 'success',
            title: 'Empresa registrada exitosamente',
            text: 'Usuario por activar',
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al registrar empresa:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al registrar empresa: ${
              err.message || 'Error desconocido'
            }`,
            showConfirmButton: true,
          });
        },
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `El campo '${fieldName}' es requerido`;
      }
      if (field.errors['minlength']) {
        return `El campo '${fieldName}' debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return `El campo '${fieldName}' debe contener solo números`;
      }
    }
    return '';
  }
}
