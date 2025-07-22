import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DeudaService } from '../../service/deuda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { TipoDeudaService } from '../../service/tipoDeuda.service';
import { FacturaService } from '../../service/factura.service';
import { PlazoPagoService } from '../../service/plazoPago.service';
import { IDeudaCliente, IPlazoPago, ITipoDeuda } from '@interfaces/IdeudaFactura';
import { CommonModule } from '@angular/common';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { IFactura } from '@interfaces/Ifactura';
import { ToastService } from '@services/toast.service';
import { Navigation } from "@components/navigation/navigation";

@Component({
  selector: 'app-update-debt',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Navigation],
  templateUrl: './update-debt.html',
})
export class UpdateDebt implements OnInit {
  registerForm!: FormGroup;
  deudaId!: number;


  empresaClienteContador: IEnterpriseClientCounter[] = [];
  tipoDeuda: ITipoDeuda[] = [];
  factura: IFactura[] = [];
  plazoPago: IPlazoPago[] = [];

  private fb = inject(FormBuilder);
  private deudaService = inject(DeudaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  private tipoDeudaService = inject(TipoDeudaService);
  private facturaService = inject(FacturaService);
  private plazoPagoService = inject(PlazoPagoService);
  protected readonly toast = inject(ToastService);

  ngOnInit(): void {
    this.deudaId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadAllClientes();
    this.loadTipoDeuda();
    this.loadPlazoPago();

    this.deudaService.getDeudaById(this.deudaId).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la deuda:', data);
        this.registerForm.patchValue({
          empresaClienteContador: this.empresaClienteContador.find(c => c.id === data.response.empresaClienteContador.id),
          tipoDeuda: this.tipoDeuda.find(t => t.id === data.response.tipoDeuda.id),
          plazoPago: this.plazoPago.find(p => p.id === data.response.plazoPago.id),
          fechaDeuda: data.response.fechaDeuda,
          valor: data.response.valor,
          descripcion: data.response.descripcion
        });
        const clienteId = data.response.empresaClienteContador?.cliente?.id;
        if (clienteId) {
          this.facturaService.getFacturAll().subscribe(response => {
            this.factura = response.response.filter(fac => fac.empresaClienteContador?.cliente?.id === clienteId);
            const facturaSeleccionada = this.factura.find(f => f.id === data.response.factura.id);
            this.registerForm.patchValue({ factura: facturaSeleccionada });
          });
        }
      },
      error: () => alert('Error cargando la deuda')
    });

    this.registerForm.get('empresaClienteContador')?.valueChanges.subscribe(cliente => {
      const clienteId = cliente?.cliente?.id;
      if (clienteId) this.loadFacturasPorCliente(clienteId);
    });
  }

  initializeForm(): void {
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
    this.facturaService.getFacturAll().subscribe(response => {
      this.factura = response.response.filter(fac => fac.empresaClienteContador?.cliente?.id === clienteId);
    });
  }

  loadTipoDeuda(): void {
    this.tipoDeudaService.getAllTipoDeuda().subscribe(response => {
      this.tipoDeuda = response.response;
    });
  }

  loadPlazoPago(): void {
    this.plazoPagoService.getAllPlazoPago().subscribe(response => {
      this.plazoPago = response.response;
    });
  }

  loadAllClientes(): void {
    this.enterpriseClientCounterService.getAllCLiente().subscribe(response => {
      this.empresaClienteContador = response.response;
    });
  }

 onSubmit(): void {
  if (this.registerForm.invalid) {
    this.toast.warning('Formulario inválido', 'Por favor complete los campos correctamente.');
    return;
  }

  const rawForm = this.registerForm.value;
  const currentUser = this.authService.getUser();

  if (!currentUser) {
    console.error('Usuario no autenticado');
    this.toast.error('Error', 'Debe iniciar sesión para actualizar la deuda.');
    return;
  }

  const deuda: IDeudaCliente = {
    ...rawForm,
    id: this.deudaId,
    valor: parseFloat(rawForm.valor),
    usuarioModificacion: currentUser?.nombre ?? 'desconocido',
    fechaModificacion: new Date()
  };

  this.deudaService.updateDeuda(deuda).subscribe({
    next: () => {
      this.toast.success('Éxito', 'La deuda se actualizó correctamente.');
      this.router.navigate(['/bill/customer-debt']);
    },
    error: (err) => {
      console.error('Error al actualizar deuda:', err);
      this.toast.error('Error al actualizar', 'No se pudo actualizar la deuda. Intente más tarde.');
    }
  });
}



}
