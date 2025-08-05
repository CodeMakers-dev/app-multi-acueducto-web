import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CorreoPersonaService } from '../../service/correoPersona.service';
import { TelefonoGeneralService } from '../../service/telefonoPersona.service';
import { ToastService } from '@services/toast.service';
import { EnterpriseClientCounterService } from '../../service/enterpriseClientCounter.service';
import { IDepartament } from '@interfaces/Idepartament';
import { ICity } from '@interfaces/Icity';
import { ICorregimiento } from '@interfaces/Icorregimiento';
import { DepartamentService } from '../../../auth/service/departament.service';
import { CityService } from '../../../auth/service/city.service';
import { CorregimientoService } from '../../../auth/service/corregimiento.service';
import { firstValueFrom } from 'rxjs';


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
    codigoDepart: number | null;
    codigoMuni: number | null;
    codigoVereda: number | null;
    numeroIdentificacion: string;
    razonSocial: string;
    nombreCliente: string;
    telefono: string;
    direccion: string;
    correo: string;
  } = {
      id: null,
      idContador: '',
      codigoDepart: 0,
      codigoMuni: 0,
      codigoVereda: 0,
      numeroIdentificacion: '',
      razonSocial: '',
      nombreCliente: '',
      telefono: '',
      direccion: '',
      correo: ''
    };
  departaments: IDepartament[] = [];
  cities: ICity[] = [];
  corregimientos: ICorregimiento[] = [];
  filteredCities: ICity[] = [];
  filteredCorregimientos: ICorregimiento[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly clientService = inject(EnterpriseClientCounterService);
  private readonly correoService = inject(CorreoPersonaService);
  private readonly telefonoService = inject(TelefonoGeneralService);
  private readonly departamentService = inject(DepartamentService);
  private readonly cityService = inject(CityService);
  private readonly corregimientoService = inject(CorregimientoService);

  ngOnInit(): void {
    Promise.all([
      firstValueFrom(this.departamentService.getAllDepartaments()),
      firstValueFrom(this.cityService.getAllCitys()),
      firstValueFrom(this.corregimientoService.getAllCorregimientos())
    ]).then(([departResp, cityResp, corResp]) => {
      this.departaments = departResp.response;
      this.cities = cityResp.response;
      this.corregimientos = corResp.response;

      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) this.loadCliente(id);
    }).catch(err => {
      console.error('❌ Error cargando datos iniciales:', err);
      this.toast.error('Error', 'No se pudieron cargar los datos iniciales');
    });
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
              id: id,
              idContador: data.contador?.serial ?? '',
              codigoDepart: data.cliente?.direccion?.departamentoId?.id ?? '',
              codigoMuni: data.cliente?.direccion?.ciudadId?.id ?? '',
              codigoVereda: Number(data.cliente?.direccion?.corregimientoId?.id) || null,
              numeroIdentificacion: data.cliente?.numeroCedula ?? '',
              razonSocial: data.empresa?.nombre ?? '',
              nombreCliente: `${data.cliente?.nombre ?? ''} ${data.cliente?.segundoNombre ?? ''} ${data.cliente?.apellido ?? ''} ${data.cliente?.segundoApellido ?? ''}`,
              telefono,
              direccion: data.cliente?.direccion?.descripcion ?? '',
              correo
            };

            this.onDepartamentChange();
            setTimeout(() => {
              this.onCitiesChange();
            }, 0);
            setTimeout(() => this.onCitiesChange(), 0);
          });
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar el cliente:', err);
        this.toast.error('Error', 'No se pudo cargar el cliente.');
      }
    });
  }

  loadDepartamentData(): void {
    this.departamentService.getAllDepartaments().subscribe(resp => {
      this.departaments = resp.response;
    });
  }

  loadAllCities(): void {
    this.cityService.getAllCitys().subscribe(resp => {
      this.cities = resp.response;
    });
  }

  loadAllCorregimientos(): void {
    this.corregimientoService.getAllCorregimientos().subscribe(resp => {
      this.corregimientos = resp.response;
    });
  }

  onDepartamentChange(): void {
    const idDept = this.cliente.codigoDepart;
    this.filteredCities = this.cities.filter(city => city.departamento?.id === idDept);

    if (!this.filteredCities.some(c => c.id === this.cliente.codigoMuni)) {
      this.cliente.codigoMuni = null;
    }
  }

  onCitiesChange(): void {
    const idCity = Number(this.cliente.codigoMuni);
    this.filteredCorregimientos = this.corregimientos.filter(cor => cor.ciudad?.id === idCity);
    const veredaId = Number(this.cliente.codigoVereda);
    if (!this.filteredCorregimientos.some(v => v.id === veredaId)) {
      this.cliente.codigoVereda = null;
    }
  }

  onSubmit(): void {
    if (!this.cliente.id) {
      this.toast.error('Error', 'El ID del cliente no es válido');
      return;
    }

    const payload = {
      id_empresa_cliente_contador: this.cliente.id,
      primer_nombre: this.extraerNombre(0),
      segundo_nombre: this.extraerNombre(1),
      primer_apellido: this.extraerNombre(2),
      segundo_apellido: this.extraerNombre(3),
      id_departamento:this.cliente.codigoDepart,
      id_ciudad:this.cliente.codigoMuni,
      id_corregimiento:this.cliente.codigoVereda,
      numero_cedula: this.cliente.numeroIdentificacion,
      descripcion_direccion: this.cliente.direccion,
      correo: this.cliente.correo,
      telefono: this.cliente.telefono,
      usuario_cambio: 'admin_sistema'
    };

    this.clientService.updateClient(payload).subscribe({
      next: () => {
        this.toast.success('Éxito', 'Cliente actualizado correctamente');
        this.router.navigate(['/client']);
      },
      error: (err) => {
        console.error('❌ Error al actualizar el cliente:', err);
        this.toast.error('Error', 'No se pudo actualizar el cliente.');
      }
    });
  }

  extraerNombre(index: number): string {
    const partes = this.cliente.nombreCliente.trim().split(' ');
    return partes[index] ?? '';
  }
}