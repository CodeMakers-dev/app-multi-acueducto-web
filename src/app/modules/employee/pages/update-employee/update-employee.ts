import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../service/empleado.service';
import { CorreoPersonaService } from '../../../client/service/correoPersona.service';
import { TelefonoGeneralService } from '../../../client/service/telefonoPersona.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-update-employee',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-employee.html',
  providers: [DatePipe]
})
export class UpdateEmployee implements OnInit {
  empleado: any = {
    id: null,
    nombreCompleto: '',
    numeroIdentificacion: '',
    codigo: '',
    correo: '',
    telefono: '',
    activo: true
  };

  private readonly route = inject(ActivatedRoute);
  private readonly empleadoService = inject(EmpleadoService);
  protected readonly correoService = inject(CorreoPersonaService);
  protected readonly telefonoService = inject(TelefonoGeneralService);
  protected readonly toast = inject(ToastService);
  protected readonly router = inject(Router);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEmpleado(id);
    }
  }

  loadEmpleado(id: number): void {
    this.empleadoService.getEmpleadoById(id).subscribe({
      next: (res) => {
        const data = res.response;
        const personaId = data.personaId;
        this.correoService.getAllCorreo().subscribe(correosResp => {
          const correo = correosResp.response.find(c => c.persona && c.persona.id === personaId)?.correo || 'Sin correo';
          this.telefonoService.getAllTelefono().subscribe(telefonosResp => {
            const telefono = telefonosResp.response.find(t => t.persona && t.persona.id === personaId)?.numero || 'Sin teléfono';
            this.empleado = {
              id: data.id,
              nombreCompleto: data.personaNombreCompleto,
              numeroIdentificacion: data.numeroCedula,
              codigo: data.codigo,
              correo,
              telefono,
              activo: data.activo
            };
          });
        });
      },
      error: (err) => {
        console.error('Error al cargar el empleado:', err);
      }
    });
  }

  onSubmit(): void {
    const partes = this.empleado.nombreCompleto.trim().split(' ');

    const payload = {
      id_empleado: this.empleado.id,
      numero_cedula: this.empleado.numeroIdentificacion,
      codigo: this.empleado.codigo,
      primer_nombre: partes[0] || '',
      segundo_nombre: partes[1] || '',
      primer_apellido: partes[2] || '',
      segundo_apellido: partes[3] || '',
      correo: this.empleado.correo,
      telefono: this.empleado.telefono,
      estado: this.empleado.activo ? 'Activo' : 'Inactivo',
      usuario_cambio: localStorage.getItem('nameUser') || 'admin'
    };

    console.log('📤 Payload a enviar:', payload);

    this.empleadoService.updateEmpleado(payload).subscribe({
      next: (res) => {
        if (res['error']) {
          console.error('❌ Error en la actualización:', res['error']);
          this.toast.error('Error al actualizar', res['error'] || 'No se pudo actualizar el empleado.');
        } else {
          console.log('✅ Empleado actualizado correctamente:', res);
          this.toast.success('Éxito', 'El empleado se actualizó correctamente.');
          this.router.navigate(['/employee']);
        }
      },
      error: (err) => {
        console.error('❌ Error inesperado al actualizar:', err);
        this.toast.error('Error inesperado', 'No se pudo actualizar el empleado. Intente más tarde.');
      }
    });
  }

}
