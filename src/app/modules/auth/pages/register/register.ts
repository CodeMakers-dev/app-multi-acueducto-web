import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddressService } from '../../service/address.service';
import { IAddress } from '@interfaces/Iaddress';

@Component({
  selector: 'app-register',
   imports: [CommonModule,RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registroForm!: FormGroup;
  isLoading: boolean = false;
  addresses: IAddress[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    // this.loadAddresses();
  }

  private initializeForm(): void {
    this.registroForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombreEmpresa: ['', [Validators.required, Validators.minLength(2)]],
      direccion: ['', [Validators.required]],
      nit: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      codigoEmpresa: ['', [Validators.required]],
    });
  }

  // private loadAddresses(): void {
  //   this.addressService.getAllAddresses().subscribe({
  //     next: (data) => {
  //       this.addresses = data;
  //       console.log('Direcciones cargadas:', this.addresses);
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar direcciones:', err);
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.isLoading = true;

      const formData = this.registroForm.value;

      console.log('Datos del formulario:', formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registroForm.controls).forEach((field) => {
      const control = this.registroForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registroForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registroForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return `${fieldName} debe contener solo números`;
      }
    }
    return '';
  }
}
