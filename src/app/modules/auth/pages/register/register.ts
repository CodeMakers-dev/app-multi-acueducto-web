
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ICorregimiento } from '@interfaces/icorregimiento';
import { DepartamentService } from '../../service/departament.service';
import { IDepartament } from '@interfaces/Idepartament';
import { CityService } from '../../service/city.service';
import { CorregimientoService } from '../../service/corregimiento.service';
import { EnterpriseService } from '../../service/enterprise.service';
import { ICity } from '../../../../../app/core/interfaces/Icity';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@interfaces/Iresponse';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  isLoading: boolean = false;
  
  departaments: IDepartament[] = [] ;
  cities: ICity[] = [];
  corregimientos: ICorregimiento[] = [];

  selectedDepartamentId: number | null = null;
  selectCitiesId: number | null = null;
  selectCorregimientoId: number | null = null;

  filteredCities: ICity[] = [];
  filteredCorregimientos: ICorregimiento[] = [];

  protected readonly router= inject(Router)
  protected readonly fb= inject(FormBuilder)
  protected readonly departamentService= inject(DepartamentService)
  protected readonly cityService= inject(CityService)
  protected readonly corregimientoService= inject(CorregimientoService)
  protected readonly enterpriseService= inject(EnterpriseService)

  ngOnInit(): void {
    this.initializeForm();
    this.loadDepartamentData();
    this.loadAllCities();
    this.loadAllCorregimiento();
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
      nit: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      codigoEmpresa: ['', [Validators.required]],
    });
  }

  /*private loadDepartamentData(): void {
    this.departamentService.getAllDepartaments().subscribe({
      next: (resp: ApiResponse<IDepartament[]>)  => {
        if (resp.success) {
          this.departaments = resp.response;
          console.log('Departamentos cargados:', this.departaments);
        } else {
          console.error('Error al cargar departamentos:', resp.message);
        }
      }
    })
  }*/

  loadDepartamentData(): void {
    this.departamentService.getAllDepartaments().subscribe((response) => {
      this.departaments = response.response;
    })
  }

  loadAllCities(): void {
    this.cityService.getAllCitys().subscribe((response) => {
      this.cities = response.response;
      console.log("DEBUG: allDepartamentos cargados:", this.cities);
      if (this.selectedDepartamentId && this.cities.length > 0) {
        this.onDepartamentChange();
      }
    }, error => {
      console.error("ERROR: No se pudieron cargar todos los departamentos", error);
    });
  }

  /*private loadCityData(): void {
    this.cityService.getAllCitys().subscribe({
      next: (resp: ApiResponse<ICity[]>)  => {
        if (resp.success) {
          this.cities = resp.response;
          console.log('Ciudades cargados:', this.cities);
        } else {
          console.error('Error al cargar ciudades:', resp.message);
        }
      }
    })
  }*/

  loadAllCorregimiento(): void {
    this.corregimientoService.getAllCorregimientos().subscribe((response) => {
      this.corregimientos = response.response;
      console.log("DEBUG: allDepartamentos cargados:", this.corregimientoService);
      if (this.selectCitiesId && this.corregimientos.length > 0) {
        this.onCitiesChange();
      }
    }, error => {
      console.error("ERROR: No se pudieron cargar todos los departamentos", error);
    });
  }

  /*private loadCorregimientoData(): void {
    this.corregimientoService.getAllCorregimientos().subscribe({
      next: (resp: ApiResponse<ICorregimiento[]>)  => {
        if (resp.success) {
          this.corregimientos = resp.response;
          console.log('Corregimientos cargados:', this.corregimientos);
        } else {
          console.error('Error al cargar corregimientos:', resp.message);
        }
      }
    })
  }*/

  onDepartamentChange(): void {
    console.log("DEBUG: onDepartamentChange disparado. selectedDepartamentId:", this.selectedDepartamentId);
    this.selectCitiesId = null;
    this.selectCorregimientoId = null;
    this.filteredCorregimientos = [];

    if (this.selectedDepartamentId) {
      this.filteredCities = this.cities.filter(
        (cyt) => Number(cyt.departamentoId.id) === Number(this.selectedDepartamentId)
      );
    } else {
      this.filteredCities = [];
    }
  }

  onCitiesChange(): void {
    console.log("DEBUG: onDepartamentoChange disparado. selectDepartamentoId:", this.selectCitiesId);
    this.selectCorregimientoId = null;

    if (this.selectCitiesId) {
      this.filteredCorregimientos = this.corregimientos.filter(
        (cor) => Number(cor.cityId.id) === Number(this.selectCitiesId)
      );
    } else {
      this.filteredCorregimientos = [];
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
        descripcionDireccion: formData.descripcionDireccion || null
      };

      console.log('Datos a enviar para registrar empresa:', empresaData);

      this.enterpriseService.registerEnterprise(empresaData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro de empresa exitoso:', response);
          alert('Empresa registrada exitosamente!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al registrar empresa:', err);
          alert(`Error al registrar empresa: ${err.message || 'Error desconocido'}`);
        }
      });

    } else {
      this.markFormGroupTouched();
      console.warn('Formulario inválido. Por favor, revisa los campos.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((field) => {
      const control = this.registerForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
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

