import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
<<<<<<< HEAD
import { IDeudaCliente, ITipoDeuda } from '@interfaces/IdeudaFactura';
=======
import { Footer } from "@components/footer/footer";
import { Header } from "@components/header/header";
import { IDeudaCliente, IPlazoPago, ITipoDeuda } from '@interfaces/IdeudaFactura';
>>>>>>> 2e9665dd6b0419140d14d4045e1c4a2436ad7830
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { TipoDeudaService } from '../../service/tipoDeuda.service';
import { DeudaService } from '../../service/deuda.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { IFactura } from '@interfaces/Ifactura';
import { FacturaService } from '../../service/factura.service';
import { PlazoPagoService } from '../../service/plazoPago.service';
import { ToastService } from '@services/toast.service';
import { Navigation } from "@components/navigation/navigation";

@Component({
  selector: 'app-create-debt',
<<<<<<< HEAD
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
=======
  imports: [Footer, Header, FormsModule, ReactiveFormsModule, CommonModule, Navigation],
>>>>>>> 2e9665dd6b0419140d14d4045e1c4a2436ad7830
  templateUrl: './create-debt.html',

})
export class CreateDebt implements OnInit {
  deudaId!: number;
  registerForm!: FormGroup;
  showSuccessMessage = false;

  empresaClienteContador: IEnterpriseClientCounter[] = [];
  empresaClienteContadorName: string[] = [];

  tipoDeuda: ITipoDeuda[] = [];
  tipoDeudaName: string[] = [];

  factura: IFactura[] = [];
  facturaName: string[] = [];

  plazoPago: IPlazoPago[] = [];
  plazoPagoName: string[] = [];

  selectedClienteId: number | null = null;
  selectTipoDeudaId: number | null = null;
  selectFacturaId: number | null = null;
  selectPlazoPagoId: number | null = null;

  protected readonly fb = inject(FormBuilder);
  protected readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  protected readonly tipoDeudaService = inject(TipoDeudaService);
  protected readonly deudaService = inject(DeudaService);
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly plazoPagoService = inject(PlazoPagoService);
  protected readonly facturaService = inject(FacturaService);
  protected readonly toast = inject(ToastService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadAllClientes();
    this.loadTipoDeuda();
    this.loadPlazoPago();

    this.registerForm.get('empresaClienteContador')?.valueChanges.subscribe(selectedCliente => {
      if (selectedCliente && selectedCliente.cliente?.id) {
        const clienteId = selectedCliente.cliente.id;
        this.loadFacturasPorCliente(clienteId);
      } else {
        this.factura = [];
      }
    });
  }
  private initializeForm(): void {
    this.registerForm = this.fb.group({
      empresaClienteContador: [null, Validators.required],
      tipoDeuda: [null, Validators.required],
      factura: [null, Validators.required],
      plazoPago: [null, Validators.required],
      fechaDeuda: ['', Validators.required],
      valor: ['', Validators.required],
      descripcion: ['']
    });
  }

  loadFacturasPorCliente(clienteId: number): void {
    this.facturaService.getFacturAll().subscribe((response) => {
      const facturasFiltradas = response.response.filter(fac => fac.empresaClienteContador.cliente?.id === clienteId);
      this.factura = facturasFiltradas;
      this.facturaName = facturasFiltradas.map((factura) => factura.codigo);
      console.log('Facturas filtradas por cliente:', facturasFiltradas);
    });
  }

  loadPlazoPago(): void {
    this.plazoPagoService.getAllPlazoPago().subscribe((response) => {
      console.log('Plazo pago:', response.response);
      this.plazoPago = response.response;
      this.plazoPagoName = response.response.map((plazoPago) => plazoPago.nombre)
    })
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
<<<<<<< HEAD
    // if (this.registerForm.valid) {
    //   const rawForm = this.registerForm.value;
    //   const currentUser = this.authService.getUser();
    //   const nombreUsuario = currentUser?.nombre ?? 'desconocido';
    //   const deuda: IDeudaCliente = {
    //     ...rawForm,
    //     valor: parseFloat(rawForm.valor),
    //     activo: true,
    //     usuarioCreacion: nombreUsuario,
    //     fechaCreacion: new Date(),
    //   };
    //   this.deudaService.saveDeuda(deuda).subscribe({
    //     next: (res) => {
    //       this.showSuccessMessage = true;
    //       setTimeout(() => {
    //         this.showSuccessMessage = false;
    //         this.router.navigate(['/bill/customer-debt']);
    //       }, 2000);
    //     },
    //     error: (err) => {
    //       console.error('Error al guardar deuda:', err);
    //       alert('Ocurrió un error al guardar la deuda.');
    //     }
    //   });
    // } else {
    //   alert('Formulario inválido. Revisa los campos requeridos.');
    // }
=======
    if (this.registerForm.invalid) {
      this.toast.warning('Formulario inválido', 'Revisa los campos requeridos.');
      return;
    }

    const rawForm = this.registerForm.value;
    const currentUser = this.authService.getUser();
    const nombreUsuario = currentUser?.nombre ?? 'desconocido';
    const fechaDeuda: string = rawForm.fechaDeuda;

    const deuda: IDeudaCliente = {
      ...rawForm,
      fechaDeuda: fechaDeuda,
      valor: parseFloat(rawForm.valor),
      activo: true,
      usuarioCreacion: nombreUsuario,
      fechaCreacion: new Date(),
    };

    console.log('Deuda a guardar:', deuda);

    this.deudaService.saveDeuda(deuda).subscribe({
      next: (res) => {
        this.toast.success('Deuda registrada correctamente.', 'Éxito');
        this.router.navigate(['/bill/customer-debt']);
      },
      error: (err) => {
        console.error('Error al guardar deuda:', err);
        this.toast.error('Ocurrió un error al guardar la deuda.', 'Error');
      }
    });
>>>>>>> 2e9665dd6b0419140d14d4045e1c4a2436ad7830
  }

}
