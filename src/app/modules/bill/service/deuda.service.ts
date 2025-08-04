import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IFactura } from "@interfaces/Ifactura";
import { IDeudaCliente } from "@interfaces/IdeudaFactura";

@Injectable({
    providedIn: 'root'
})
export class DeudaService {

    private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_DEUDA}`;

    protected readonly router = inject(Router)
    protected readonly http = inject(HttpClient)

    getAllDeuda(): Observable<ApiResponse<IDeudaCliente[]>> {
        return this.http.get<ApiResponse<IDeudaCliente[]>>(`${this.apiUrl}/${END_POINT_SERVICE.GET_DEUDA_ALL}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        let errorMessage = 'An unknown error occurred while loading factura.';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client Error: ${error.error.message}`;
        } else {
            errorMessage = `Server Error: ${error.status} - ${error.message || ''}`;
            if (error.error && error.error.message) {
                errorMessage = `${errorMessage} - ${error.error.message}`;
            }
        }
        console.error('Error in facturaService:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    saveDeuda(deuda: IDeudaCliente): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}`, deuda).pipe(
            catchError(this.handleError)
        );
    }
    deleteDeudaById(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }
    getDeudaById(id: number): Observable<ApiResponse<IDeudaCliente>> {
        return this.http.get<ApiResponse<IDeudaCliente>>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }
    updateDeuda(deuda: IDeudaCliente): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`${this.apiUrl}`, deuda).pipe(
            catchError(this.handleError)
        );
    }

}