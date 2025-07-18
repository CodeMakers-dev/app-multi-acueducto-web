import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IFactura } from "@interfaces/Ifactura";

@Injectable({
    providedIn: 'root'
})
export class FacturaService {

    private readonly apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_FACTURA}`;

    protected readonly router = inject(Router)
    protected readonly http = inject(HttpClient)

    getAllFactura(
        page: number,
        pageSize: number,
        searchTerm: string,
        sortColumn: string,
        sortDirection: 'asc' | 'desc'
    ): Observable<ApiResponse<IFactura[]>> {

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

        return this.http.get<ApiResponse<IFactura[]>>(`${this.apiUrl}/${END_POINT_SERVICE.GET_FACTURA_ALL}`, { params }).pipe(
            catchError(this.handleError)
        );
    }

    deleteFacturaById(id: number): Observable<ApiResponse<any>> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<ApiResponse<any>>(url).pipe(
            catchError(this.handleError)
        );
    }

    getFacturaById(id: number): Observable<ApiResponse<IFactura>> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<ApiResponse<IFactura>>(url).pipe(
            catchError(this.handleError)
        );
    }

    updateFactura(factura: IFactura): Observable<ApiResponse<IFactura>> {
        return this.http.put<ApiResponse<IFactura>>(this.apiUrl, factura).pipe(
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
