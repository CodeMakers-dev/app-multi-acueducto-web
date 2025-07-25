import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '@interfaces/Iresponse';
import { IPerson } from '@interfaces/Iperson';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private readonly apiUrl = `${environment.apiUrl}`;

  protected readonly router= inject(Router)
  protected readonly http= inject(HttpClient)

  getAllClients(
    page: number,
    pageSize: number,
    searchTerm: string,
    sortColumn: string,
    sortDirection: 'asc' | 'desc'
  ): Observable<ApiResponse<IPerson[]>> {

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
    return this.http.get<ApiResponse<IPerson[]>>(`${this.apiUrl}/Persona/all`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido al cargar departamentos.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message || ''}`;
      if (error.error && error.error.message) {
        errorMessage = `${errorMessage} - ${error.error.message}`;
      }
    }
    console.error('Error en DepartamentoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
