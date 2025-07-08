import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ICorregimiento } from '@interfaces/icorregimiento';
import { ApiResponse } from '@interfaces/Iresponse';

@Injectable({
  providedIn: 'root'
})
export class CorregimientoService {

  private apiUrl = `${environment.apiUrl}`;
  protected readonly http = inject(HttpClient);

  getAllCorregimientos(): Observable<ApiResponse<ICorregimiento[]>> {
    return this.http.get<ApiResponse<ICorregimiento[]>>(`${this.apiUrl}/Corregimiento/all`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido al cargar corregimientos.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message || ''}`;
      if (error.error && error.error.message) {
        errorMessage = `${errorMessage} - ${error.error.message}`;
      }
    }
    console.error('Error en CorregimientoService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
}
