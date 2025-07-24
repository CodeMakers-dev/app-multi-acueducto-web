import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbonoService } from '../../service/abono.service';
import { IAbonoFactura } from '@interfaces/IdeudaFactura';
import { AuthService } from '../../../auth/service/auth.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-create-credit',
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './create-credit.html',

})
export class CreateCredit implements OnInit {
  deudaId!: number;
  abonoForm!: FormGroup;
  mensajeExito: string = '';

  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly fb = inject(FormBuilder);
  protected readonly abonoService = inject(AbonoService);
  protected readonly authService = inject(AuthService);
  protected readonly toast = inject(ToastService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.deudaId = +params.get('id')!;
    });

    this.abonoForm = this.fb.group({
      valor: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

 onSubmit(): void {
  if (this.abonoForm.invalid) {
    this.toast.warning('Formulario inválido', 'Por favor complete los campos correctamente.');
    return;
  }

  const currentUser = this.authService.getUser();

  if (!currentUser) {
    console.error('Usuario no autenticado');
    this.toast.error('Error', 'Debe iniciar sesión para registrar un abono.');
    return;
  }

  const abono: Partial<IAbonoFactura> = {
    valor: this.abonoForm.value.valor,
    deudaCliente: { id: this.deudaId } as any,
    usuarioCreacion: currentUser.nombre
  };

  this.abonoService.saveAbono(abono as IAbonoFactura).subscribe({
    next: () => {
      this.toast.success('Éxito', 'El abono se registró correctamente.');
      this.router.navigate(['/bill/customer-debt']);
    },
    error: (err) => {
      console.error('Error al guardar el abono:', err);
      this.toast.error('Error al guardar', 'No se pudo registrar el abono. Intente más tarde.');
    }
  });
}
}
