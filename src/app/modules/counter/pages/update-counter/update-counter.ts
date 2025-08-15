import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICounter } from '@interfaces/Icounter';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { CounterService } from '../../service/counter.service';
import { ITypeCounter } from '@interfaces/ItypeCounter';
import { AddressService } from '../../service/address.service';
import { ToastService } from '@services/toast.service';
import { TypeCounterService } from '../../service/typeCounter.service';

@Component({
  selector: 'app-update-counter',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex items-center justify-center py-4">
    <div class="max-w-3xl w-full mx-auto p-6">
        @if (contador) {
            <form #f="ngForm" (ngSubmit)="onSubmit()" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700">
                <h2 class="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Editar Contador</h2>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex flex-col">
                        <label class="mb-1 font-medium text-gray-700 dark:text-white">Tipo de Contador:</label>
                        @let types = getCounterType.value();
                        @if (types.length) {
                            <select
                                [(ngModel)]="selectedTipoContadorId"
                                name="tipoContador"
                                class="p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            >
                                @for (types of types; track types.id) {
                                    <option [value]="types.id">{{ types.nombre }}</option>
                                }
                            </select>
                        } @else {
                            <p class="p-3 text-gray-500">Cargando tipos...</p>
                        }
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-1 font-medium text-gray-700 dark:text-white">Número de Serie:</label>
                        <input
                            type="text"
                            [(ngModel)]="contador.serial"
                            name="serial"
                            class="p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                    </div>

                    <div class="flex flex-col">
                        <label class="mb-1 font-medium text-gray-700 dark:text-white">Dirección:</label>
                        <input
                            type="text"
                            [(ngModel)]="contador.descripcion.descripcion"
                            name="direccionDescripcion"
                            class="p-3 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        />
                    </div>

                    <div class="col-span-1"></div>

                    <div class="col-span-1 sm:col-span-2 flex justify-center mt-4">
                        <button
                            type="submit"
                            [disabled]="f.invalid"
                            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md dark:shadow-gray-700/50 cursor-pointer transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-2"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </form>
        }
    </div>
</div>
  `
})
export class UpdateCounter {

  contador: ICounter | null = null;
  selectedTipoContadorId: number | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private routeParams = toSignal(this.route.paramMap);
  private readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  private readonly counterService = inject(CounterService);
  private readonly typeCounterService = inject(TypeCounterService)
  private readonly addressService = inject(AddressService);
  protected readonly toast = inject(ToastService);

  // si llega a tener problemas con la data implementar un computed   a getCounterType

  constructor() {
    console.log("esta es la data gays___", Date().toString())
    effect(() => {
      const resourceData = this.dataenterpriseClientCounter.value();
      const params = this.routeParams();
      
      if (params && resourceData?.response?.contador) {
        const id = Number(params.get('id'));
        console.log('ID seleccionado:', id);
        console.log('Data enterpriseClientCounter:', resourceData.response.contador);
        console.log('Contador------------------:', this.getCounterType.value());
        
        this.contador = resourceData.response.contador;
        this.selectedTipoContadorId = this.contador.tipoContador.id;
      }
    });
  }

  dataenterpriseClientCounter = rxResource({
    params: () => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      return id || null; 
    },
    stream: ({ params: id }) => {
      if (id) {
        return this.enterpriseClientCounterService.getEntClientCounterById(id);
      }
      return of(null); 
    }
  });

  getCounterType = rxResource<ITypeCounter[], void>({
  stream: () => this.typeCounterService.getAllTypeCounters().pipe(
    map(resp => resp.response)
  ),
  defaultValue: []
});


  onSubmit(): void {
  console.log('Datos TipoContador------>>', this.selectedTipoContadorId)
  if (this.contador) {
    console.log('Datos a actualizar:', this.contador);
    
    const updatedAddress = {
      id: this.contador.descripcion.id,
      descripcion: this.contador.descripcion.descripcion,
      departamentoId: this.contador.descripcion.departamentoId,
      ciudadId: this.contador.descripcion.ciudadId,
      corregimientoId: this.contador.descripcion.corregimientoId,
      activo: this.contador.descripcion.activo,
      usuarioCreacion: this.contador.descripcion.usuarioCreacion,
      fechaCreacion: this.contador.descripcion.fechaCreacion,
      usuarioModificacion: null,
      fechaModificacion: new Date().toISOString().slice(0, 19)
    };

    const updatedCounter = {
      id: this.contador.id,
      cliente: {id: this.contador.cliente.id},
      tipoContador: {id: Number(this.selectedTipoContadorId)},
      descripcion: {id:this.contador.descripcion.id},
      serial: this.contador.serial,
      activo: this.contador.activo,
      usuarioCreacion: this.contador.usuarioCreacion,
      fechaCreacion: this.contador.fechaCreacion,
      usuarioActualizacion: null,
      fechaModificacion: new Date().toISOString().slice(0, 19)
    };

    this.addressService.updateAddress(updatedAddress).subscribe({
    next: (addressResponse) => {
    if (!addressResponse.success) {
      this.toast.error('Error al actualizar dirección', addressResponse.message || 'No se pudo actualizar la dirección.');
    } else {
      console.log('Dirección actualizada correctamente:', addressResponse);
      
      this.counterService.updateCounter(updatedCounter).subscribe({
        next: (counterResponse) => {
          if (!counterResponse.success) {
            console.error('Error en actualización de contador:', counterResponse.message);
            this.toast.error('Error al actualizar contador', counterResponse.message || 'No se pudo actualizar el contador.');
          } else {
            console.log('Contador actualizado correctamente:', counterResponse);
            this.toast.success('Éxito', 'El contador se actualizó correctamente.');
            this.router.navigate(['/counter']);
          }
        },
        error: (err) => {
          console.error('Error inesperado al actualizar contador:', err);
          this.toast.error('Error inesperado', 'No se pudo actualizar el contador. Intente más tarde.');
        }
      });
    }
  },
  error: (err) => {
    console.error('❌ Error inesperado al actualizar dirección:', err);
    this.toast.error('Error inesperado', 'No se pudo actualizar la dirección. Intente más tarde.');
  }
  });
  }
}
}