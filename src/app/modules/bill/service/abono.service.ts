import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IFactura } from "@interfaces/Ifactura";
import { IAbonoFactura, IDeudaCliente } from "@interfaces/IdeudaFactura";

@Injectable({
    providedIn: 'root'
})
export class AbonoService {

    private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_ABONO}`;

    protected readonly router = inject(Router)
    protected readonly http = inject(HttpClient)

    getAllAbono(): Observable<ApiResponse<IAbonoFactura[]>> {
        return this.http.get<ApiResponse<IAbonoFactura[]>>(`${this.apiUrl}/${END_POINT_SERVICE.GET_ABONO_ALL}`).pipe(
            catchError(this.handleError)
        );
    }

    saveAbono(abono: IAbonoFactura): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}`, abono).pipe(
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
}