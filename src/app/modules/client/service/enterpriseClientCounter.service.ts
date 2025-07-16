import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '@interfaces/Iresponse';
import { END_POINT_SERVICE } from '../../../environments/environment.variables';
import { IEnterpriseClientCounter } from '@interfaces/IenterpriseClientCounter';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseClientCounterService {

  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_ENT_CLI_COU}`;

  protected readonly router= inject(Router)
  protected readonly http= inject(HttpClient)

  getAllEnterpriseClientCounters(
    page: number,
    pageSize: number,
    searchTerm: string,
    sortColumn: string,
    sortDirection: 'asc' | 'desc'
  ): Observable<ApiResponse<IEnterpriseClientCounter[]>> {

    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.append('searchTerm', searchTerm);
    }
    if (sortColumn) {
      params = params.append('sortColumn', sortColumn);
      params = params.append('sortDirection', sortDirection);
    }

    return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(`${this.apiUrl}/all`, { params }).pipe(
      catchError(this.handleError)
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

  getAllCLiente(): Observable<ApiResponse<IEnterpriseClientCounter[]>> {
    const url = `${this.apiUrl}/${END_POINT_SERVICE.GET_ALL_CLI}`;
      return this.http.get<ApiResponse<IEnterpriseClientCounter[]>>(url);
    }
}
