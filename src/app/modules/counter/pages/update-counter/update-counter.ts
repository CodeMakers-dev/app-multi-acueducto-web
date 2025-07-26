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
  <div class="container mx-auto px-4 py-8">
  <h2 class="text-2xl font-semibold text-center mb-6">Editar Contador</h2>

  @if (contador) {
    <form #f="ngForm" (ngSubmit)="onSubmit()"
          class="mx-auto max-w-md grid grid-cols-2 gap-4">
      
      <div class="col-span-1">
  <label class="font-medium mb-1 block">Tipo de Contador:</label>

  @let types = getCounterType.value();
  
  @if (types.length) {
    <select
  [(ngModel)]="selectedTipoContadorId"
  name="tipoContador"
  class="w-full p-3 border rounded-md"
>
  @for (types of types; track types.id) {
    <option [value]="types.id">{{ types.nombre }}</option>
  }
</select>
  } @else {
    <p class="text-gray-500">Cargando tipos...</p>
  }
</div>

      <div class="col-span-1">
        <label class="font-medium mb-1 block">Número de Serie:</label>
        <input type="text"
               [(ngModel)]="contador.serial"
               name="serial"
               class="w-full p-3 border rounded-md" />
      </div>

      <div class="col-span-1">
        <label class="font-medium mb-1 block">Dirección:</label>
        <input type="text"
               [(ngModel)]="contador.descripcion.descripcion"
               name="direccionDescripcion"
               class="w-full p-3 border rounded-md" />
      </div>

      <div class="col-span-1"></div>

      <div class="col-span-2 flex justify-center mt-4">
        <button type="submit"
                [disabled]="f.invalid"
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Actualizar
        </button>
      </div>
    </form>
  }
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

    console.log('📤 Payload dirección a enviar:', updatedAddress);
    console.log('📤 Payload contador a enviar:', updatedCounter);

    this.addressService.updateAddress(updatedAddress).subscribe({
  next: (addressResponse) => {
    if (!addressResponse.success) { // ✅ Usar success en lugar de error
      console.error('❌ Error en actualización de dirección:', addressResponse.message);
      this.toast.error('Error al actualizar dirección', addressResponse.message || 'No se pudo actualizar la dirección.');
    } else {
      console.log('✅ Dirección actualizada correctamente:', addressResponse);
      
      this.counterService.updateCounter(updatedCounter).subscribe({
        next: (counterResponse) => {
          if (!counterResponse.success) { // ✅ Usar success
            console.error('❌ Error en actualización de contador:', counterResponse.message);
            this.toast.error('Error al actualizar contador', counterResponse.message || 'No se pudo actualizar el contador.');
          } else {
            console.log('✅ Contador actualizado correctamente:', counterResponse);
            this.toast.success('Éxito', 'El contador se actualizó correctamente.');
            this.router.navigate(['/counter']);
          }
        },
        error: (err) => {
          console.error('❌ Error inesperado al actualizar contador:', err);
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