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

    getAllAbono(
        page: number,
        pageSize: number,
        searchTerm: string,
        sortColumn: string,
        sortDirection: 'asc' | 'desc'
    ): Observable<ApiResponse<IAbonoFactura[]>> {

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

        return this.http.get<ApiResponse<IAbonoFactura[]>>(`${this.apiUrl}/${END_POINT_SERVICE.GET_ABONO_ALL}`, { params }).pipe(
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