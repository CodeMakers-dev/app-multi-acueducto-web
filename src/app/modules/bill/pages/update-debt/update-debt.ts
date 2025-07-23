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
import { IFactura, IfacturaResponse } from '@interfaces/Ifactura';
import { ToastService } from '@services/toast.service';
import { ApiResponse } from '@interfaces/Iresponse';

@Component({
  selector: 'app-update-debt',
  imports: [CommonModule,  FormsModule, ReactiveFormsModule ],
  templateUrl: './update-debt.html',
})
export class UpdateDebt implements OnInit {
  registerForm!: FormGroup;
  deudaId!: number;
  

  empresaClienteContador: IEnterpriseClientCounter[] = [];
  tipoDeuda: ITipoDeuda[] = [];
  factura: IFactura[] = [];
  facturas: IfacturaResponse[] = [];
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

    this.registerForm.get('empresaClienteContador')?.valueChanges.subscribe(selectedCliente => {
      console.log('Cliente seleccionado (en valueChanges):', selectedCliente);
      const empresaClienteContadorId = selectedCliente?.id;
      if (empresaClienteContadorId) {
        this.loadFacturasPorCliente(empresaClienteContadorId);
      } else {
        this.facturas = [];
      }
    });
    this.deudaService.getDeudaById(this.deudaId).subscribe({
      next: (data) => {
        console.log('Datos recibidos de la deuda:', data);
        const deudaResponse = data.response;
        this.registerForm.patchValue({
          fechaDeuda: deudaResponse.fechaDeuda,
          valor: deudaResponse.valor,
          descripcion: deudaResponse.descripcion
        });
        const selectedEmpresaClienteContador = this.empresaClienteContador.find(c => c.id === deudaResponse.empresaClienteContador.id);
        if (selectedEmpresaClienteContador) {
          this.registerForm.get('empresaClienteContador')?.patchValue(selectedEmpresaClienteContador);
          this.loadFacturasPorCliente(selectedEmpresaClienteContador.id, deudaResponse.factura.id);
        }
        const selectedTipoDeuda = this.tipoDeuda.find(t => t.id === deudaResponse.tipoDeuda.id);
        if (selectedTipoDeuda) {
          this.registerForm.get('tipoDeuda')?.patchValue(selectedTipoDeuda);
        }
        const selectedPlazoPago = this.plazoPago.find(p => p.id === deudaResponse.plazoPago.id);
        if (selectedPlazoPago) {
          this.registerForm.get('plazoPago')?.patchValue(selectedPlazoPago);
        }
      },
      error: (err) => {
        console.error('Error cargando la deuda:', err);
        this.toast.error('Error', 'Error cargando la deuda.');
      }
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


  loadFacturasPorCliente(empresaClienteContadorId: number, facturaIdToSelect?: number): void {
    this.facturaService.getFacturAll().subscribe((response: ApiResponse<IfacturaResponse[]>) => {
      this.facturas = response.response.filter(fac => fac.empresaClienteContadorId === empresaClienteContadorId);
      console.log('Facturas filtradas por cliente (loadFacturasPorCliente):', this.facturas);

      if (facturaIdToSelect) {
        const facturaSeleccionada = this.facturas.find(f => f.id === facturaIdToSelect);
        if (facturaSeleccionada) {
          this.registerForm.get('factura')?.patchValue(facturaSeleccionada);
        }
      }
    });
  }

  loadTipoDeuda(): void {
    this.tipoDeudaService.getAllTipoDeuda().subscribe(response => {
      this.tipoDeuda = response.response;
      console.log('Tipos de deuda cargados:', this.tipoDeuda);
    });
  }

  loadPlazoPago(): void {
    this.plazoPagoService.getAllPlazoPago().subscribe(response => {
      this.plazoPago = response.response;
      console.log('Plazos de pago cargados:', this.plazoPago);
    });
  }

  loadAllClientes(): void {
    this.enterpriseClientCounterService.getAllCLiente().subscribe(response => {
      this.empresaClienteContador = response.response;
      console.log('Clientes cargados:', this.empresaClienteContador);
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
      empresaClienteContador: rawForm.empresaClienteContador,
      tipoDeuda: rawForm.tipoDeuda, 
      factura: rawForm.factura, 
      plazoPago: rawForm.plazoPago, 

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