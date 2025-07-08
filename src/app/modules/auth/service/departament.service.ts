import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.local';
import { catchError, Observable, throwError } from 'rxjs';
import { IDepartament } from '@interfaces/Idepartament';
import { ApiResponse } from '@interfaces/Iresponse';

@Injectable({
  providedIn: 'root'
})
export class DepartamentService {

  private apiUrl = `${environment.apiUrl}`;

  protected readonly router= inject(Router)
  protected readonly http= inject(HttpClient)

  getAllDepartaments(): Observable<ApiResponse<IDepartament[]>> {
    return this.http.get<ApiResponse<IDepartament[]>>(`${this.apiUrl}/Departamento/all`).pipe(
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
