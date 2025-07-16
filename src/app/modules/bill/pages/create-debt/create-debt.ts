import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Footer } from "@components/footer/footer";
import { Header } from "@components/header/header";
import { IDeudaCliente, ITipoDeuda } from '@interfaces/IdeudaFactura';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { TipoDeudaService } from '../../service/tipoDeuda.service';
import { DeudaService } from '../../service/deuda.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-create-debt',
  imports: [Footer, Header, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-debt.html',

})
export class CreateDebt implements OnInit {
  registerForm!: FormGroup;
  showSuccessMessage = false;
  empresaClienteContador: IEnterpriseClientCounter[] = [];
  empresaClienteContadorName: string[] = [];
  tipoDeuda: ITipoDeuda[] = [];
  tipoDeudaName: string[] = [];

  selectedClienteId: number | null = null;
  selectTipoDeudaId: number | null = null;

  protected readonly fb = inject(FormBuilder);
  protected readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  protected readonly tipoDeudaService = inject(TipoDeudaService);
  protected readonly deudaService = inject(DeudaService);
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadAllClientes();
    this.loadTipoDeuda();

  }
  private initializeForm(): void {
    this.registerForm = this.fb.group({
      empresaClienteContador: [null, Validators.required],
      tipoDeuda: [null, Validators.required],
      fechaDeuda: ['', Validators.required],
      valor: ['', Validators.required],
      descripcion: ['']
    });
  }
  loadTipoDeuda(): void {
    this.tipoDeudaService.getAllTipoDeuda().subscribe((response) => {
      console.log('Tipos de deuda:', response.response);
      this.tipoDeuda = response.response;
      this.tipoDeudaName = response.response.map((tipoDeuda) => tipoDeuda.nombre)
    })
  }
  loadAllClientes(): void {
    this.enterpriseClientCounterService.getAllCLiente().subscribe((response) => {
      console.log('Tipos de deuda:', response.response);
      this.empresaClienteContador = response.response;
      this.empresaClienteContadorName = response.response.map((empresaClienteContador) => empresaClienteContador.cliente.nombre)
    })
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const rawForm = this.registerForm.value;
      const currentUser = this.authService.getUser();
      const nombreUsuario = currentUser?.nombre ?? 'desconocido';
      const deuda: IDeudaCliente = {
        ...rawForm,
        valor: parseFloat(rawForm.valor),
        activo: true,
        usuarioCreacion: nombreUsuario,
        fechaCreacion: new Date(),
      };
      this.deudaService.saveDeuda(deuda).subscribe({
        next: (res) => {
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/bill/customer-debt']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error al guardar deuda:', err);
          alert('Ocurrió un error al guardar la deuda.');
        }
      });
    } else {
      alert('Formulario inválido. Revisa los campos requeridos.');
    }
  }




}
