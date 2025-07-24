import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IEmpleadoEmpresaResponse } from "@interfaces/Iemployee";

@Injectable({
    providedIn: 'root'
})
export class EmpleadoService {

    private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_EMPLEADO}`;
    protected readonly router = inject(Router)
    protected readonly http = inject(HttpClient)

    getAllEmpleado(
        page: number,
        pageSize: number,
        searchTerm: string,
        sortColumn: string,
        sortDirection: 'asc' | 'desc'
    ): Observable<ApiResponse<IEmpleadoEmpresaResponse[]>> {

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

        return this.http.get<ApiResponse<IEmpleadoEmpresaResponse[]>>(`${this.apiUrl}/${END_POINT_SERVICE.GET_EMPLEADO_ALL}`, { params }).pipe(
            catchError(this.handleError)
        );
    }
    private handleError(error: any): Observable<never> {
        let errorMessage = 'An unknown error occurred while loading empleado.';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `empleado Error: ${error.error.message}`;
        } else {
            errorMessage = `Server Error: ${error.status} - ${error.message || ''}`;
            if (error.error && error.error.message) {
                errorMessage = `${errorMessage} - ${error.error.message}`;
            }
        }
        console.error('Error in empleado:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    saveEmpleado(data: any): Observable<Map<string, any>> {
        const url = `${environment.apiUrl}/${END_POINT_SERVICE.GET_EMPLEADO}/${END_POINT_SERVICE.GET_SAVE_EMPLEADO}`;
        return this.http.post<Map<string, any>>(url, data).pipe(
            catchError(this.handleError)
        );
    }
  getEmpleadoById(id: number): Observable<ApiResponse<IEmpleadoEmpresaResponse>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ApiResponse<IEmpleadoEmpresaResponse>>(url).pipe(
        catchError(this.handleError)
    );
}

updateEmpleado(data: any): Observable<Record<string, any>> {
  const url = `${environment.apiUrl}/${END_POINT_SERVICE.GET_EMPLEADO}/update`;
  return this.http.put<Record<string, any>>(url, data).pipe(
    catchError(this.handleError)
  );
}


}
