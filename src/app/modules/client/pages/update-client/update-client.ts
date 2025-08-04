import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../../employee/service/empleado.service';
import { CorreoPersonaService } from '../../service/correoPersona.service';
import { TelefonoGeneralService } from '../../service/telefonoPersona.service';
import { ToastService } from '@services/toast.service';
import { EnterpriseClientCounterService } from '../../service/enterpriseClientCounter.service';

@Component({
  selector: 'app-update-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-client.html',
  providers: [DatePipe]
})
export class UpdateClient implements OnInit {
  cliente: {
  id: number | null;
  idContador: string;
  codigoVereda: string;
  numeroIdentificacion: string;
  razonSocial: string;
  nombreCliente: string;
  telefono: string;
  direccion: string;
  correo: string;
} = {
  id: null,
  idContador: '',
  codigoVereda: '',
  numeroIdentificacion: '',
  razonSocial: '',
  nombreCliente: '',
  telefono: '',
  direccion: '',
  correo: ''
};

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly clientService = inject(EnterpriseClientCounterService);
  private readonly correoService = inject(CorreoPersonaService);
  private readonly telefonoService = inject(TelefonoGeneralService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCliente(id);
    }
  }

  loadCliente(id: number): void {
    this.clientService.getClienteById(id).subscribe({
      next: (res) => {
        const data = res.response;
        const personaId = data.cliente?.id;

        this.correoService.getAllCorreo().subscribe(correosResp => {
          const correo = correosResp.response.find(c => c.persona?.id === personaId)?.correo ?? '';

          this.telefonoService.getAllTelefono().subscribe(telefonosResp => {
            const telefono = telefonosResp.response.find(t => t.persona?.id === personaId)?.numero ?? '';

            this.cliente = {
              id: data.cliente?.id,
              idContador: data.contador?.serial ?? '',
              codigoVereda: data.cliente?.direccion?.corregimientoId?.nombre ?? '',
              numeroIdentificacion: data.cliente?.numeroCedula ?? '',
              razonSocial: data.empresa?.nombre ?? '',
              nombreCliente: `${data.cliente?.nombre ?? ''} ${data.cliente?.segundoNombre ?? ''} ${data.cliente?.apellido ?? ''} ${data.cliente?.segundoApellido ?? ''}`,
              telefono,
              direccion: data.cliente?.direccion?.descripcion ?? '',
              correo
            };
          });
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar el cliente:', err);
        this.toast.error('Error', 'No se pudo cargar el cliente.');
      }
    });
  }

  onSubmit(): void {
  }
}