import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IEnterpriseSp } from '@interfaces/IenterpriseSp';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private apiUrl = `${environment.apiUrl}`;

  protected readonly router= inject(Router)
  protected readonly http= inject(HttpClient)

  registerEnterprise(empresaData: IEnterpriseSp) {
    return this.http.post(`${this.apiUrl}/Empresa/crear_o_actualizar_empresa`, empresaData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}
