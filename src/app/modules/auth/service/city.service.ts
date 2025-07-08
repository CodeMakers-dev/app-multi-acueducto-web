import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ICity } from '@interfaces/Icity';
import { ApiResponse } from '@interfaces/Iresponse';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private apiUrl = `${environment.apiUrl}`;
  protected readonly http = inject(HttpClient);

  getAllCitys(): Observable<ApiResponse<ICity[]>> {
    return this.http.get<ApiResponse<ICity[]>>(`${this.apiUrl}/Ciudad/all`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido al cargar ciudades.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status} - ${error.message || ''}`;
      if (error.error && error.error.message) {
        errorMessage = `${errorMessage} - ${error.error.message}`;
      }
    }
    console.error('Error en CiudadService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
