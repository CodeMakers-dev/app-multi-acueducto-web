import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient } from '@angular/common/http';
import { COUNTER, TYPE_COUNTER } from '../../../environments/environment.variables';
import { Observable } from 'rxjs';
import { ApiResponse } from '@interfaces/Iresponse';
import { ITypeCounter } from '@interfaces/ItypeCounter';
import { Router } from '@angular/router';
import { ICounter } from '@interfaces/Icounter';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private apiUrl = `${environment.apiUrl}/${COUNTER.COUNTER}`;
  protected readonly router = inject(Router);
  protected readonly http = inject(HttpClient);

  updateCounter(counter: any): Observable<ApiResponse<ICounter>> {
    const url = `${this.apiUrl}`;
    return this.http.post<ApiResponse<ICounter>>(url, counter);
  }
}
