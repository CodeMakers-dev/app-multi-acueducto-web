import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnterpriseClientCounterService } from '../../../client/service/enterpriseClientCounter.service';
import { ActivatedRoute } from '@angular/router';
import { ICounter } from '@interfaces/Icounter';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { CounterService } from '../../service/counter.service';
import { ITypeCounter } from '@interfaces/ItypeCounter';

@Component({
  selector: 'app-update-counter',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-counter.html'
})
export class UpdateCounter {

  private readonly route = inject(ActivatedRoute);
  private routeParams = toSignal(this.route.paramMap);
  private readonly enterpriseClientCounterService = inject(EnterpriseClientCounterService);
  private readonly counterService = inject(CounterService);

  contador: ICounter | null = null;

  // si llega a tener problemas con la data implementar un computed   a getCounterType

  constructor() {
    effect(() => {
      const resourceData = this.dataenterpriseClientCounter.value();
      const params = this.routeParams();
      
      if (params && resourceData?.response?.contador) {
        const id = Number(params.get('id'));
        console.log('ID seleccionado:', id);
        console.log('Data enterpriseClientCounter:', resourceData.response.contador);
        console.log('Contador------------------:', this.getCounterType.value());
        
        this.contador = resourceData.response.contador;
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
  stream: () => this.counterService.getAllCounters().pipe(
    map(resp => resp.response)
  ),
  defaultValue: []
});


  onSubmit(): void {
    if (this.contador) {
      console.log('Datos a actualizar:', this.contador);
    }
  }
}