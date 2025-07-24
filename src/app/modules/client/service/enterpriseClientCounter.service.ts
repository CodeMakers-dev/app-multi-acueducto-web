import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient } from '@angular/common/http';
import {  map, Observable } from 'rxjs';
import { ApiResponse } from '@interfaces/Iresponse';
import { END_POINT_SERVICE } from '../../../environments/environment.variables';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { Router } from '@angular/router';
import { IPerson } from '@interfaces/Iperson';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseClientCounterService {

  private readonly apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_ENT_CLI_COU}`;
  protected readonly router= inject(Router)
  protected readonly http= inject(HttpClient)

  getAllCLiente(): Observable<ApiResponse<IEnterpriseClientCounter[]>> {
    const url = `${this.apiUrl}/${END_POINT_SERVICE.GET_ALL_CLI}`;
      return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(url)
    }

    getAllClienteEnterprise(): Observable<IPerson[]> {
    const url = `${this.apiUrl}/${END_POINT_SERVICE.GET_ALL_CLI}`;
    return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(url).pipe(
      map((response: ApiResponse<IEnterpriseClientCounter[]>) => {
        return response.response.map(item => item.cliente);
      })
    );
  }

}
