import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = `${environment.apiUrl}`;

  protected readonly router= inject(Router)
  protected readonly http= inject(HttpClient)

  getAllAddresses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Direccion/all`);
  }
}
