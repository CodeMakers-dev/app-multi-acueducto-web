import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient } from '@angular/common/http';
import {  catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '@interfaces/Iresponse';
import { END_POINT_SERVICE, ENTERPRISE_CLIENT_COUNT } from '../../../environments/environment.variables';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { Router } from '@angular/router';
import { IPerson } from '@interfaces/Iperson';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseClientCounterService {

  private readonly apiUrl = `${environment.apiUrl}/${ENTERPRISE_CLIENT_COUNT.ENT_CLI_COU}`;

  protected readonly router= inject(Router)
  protected readonly http= inject(HttpClient)

  getAllCLiente(): Observable<ApiResponse<IEnterpriseClientCounter[]>> {
    const url = `${this.apiUrl}/${ENTERPRISE_CLIENT_COUNT.GET_ALL_CLI}`;
      return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(url)
    }

    getAllClienteEnterprise(): Observable<IPerson[]> {
    const url = `${this.apiUrl}/${ENTERPRISE_CLIENT_COUNT.GET_ALL_CLI}`;
    return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(url).pipe(
      map((response: ApiResponse<IEnterpriseClientCounter[]>) => {
        return response.response.map(item => item.cliente);
      })
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred while loading enterprise client counters.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message || ''}`;
      if (error.error && error.error.message) {
        errorMessage = `${errorMessage} - ${error.error.message}`;
      }
    }
    console.error('Error in EnterpriseClientCounterService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // getAllCLiente(): Observable<ApiResponse<IEnterpriseClientCounter[]>> {
  //   const url = `${this.apiUrl}/${ENTERPRISE_CLIENT_COUNT.GET_ALL_CLI}`;
  //     return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(url);
  //   }

  getAllCounterByIdEnterprise(enterpriseId: number): Observable<ApiResponse<IEnterpriseClientCounter[]>> {
    const url = `${this.apiUrl}/${ENTERPRISE_CLIENT_COUNT.GET_ENT_BY_ID}/${enterpriseId}`;
    return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(url);
  }

  getEntClientCounterById(id: number): Observable<ApiResponse<IEnterpriseClientCounter>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ApiResponse<IEnterpriseClientCounter>>(url).pipe(
      catchError(this.handleError)
    );
  }
   updateEstado(data: { id_persona: number, activo: boolean, usuario_cambio: string }): Observable<Map<string, any>> {
      const url = `${environment.apiUrl}/${ENTERPRISE_CLIENT_COUNT.ENT_CLI_COU}/${END_POINT_SERVICE.POST_UPD_ESTADO}`;
      return this.http.post<Map<string, any>>(url, data).pipe(
        catchError(this.handleError)
      );
    }
}
