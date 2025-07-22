import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IEstado, ILectura } from "@interfaces/Ifactura";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class LecturaService {

    private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_LECTURA}`;

    protected readonly router = inject(Router)
    protected readonly http = inject(HttpClient)

    getAllLectura(
        page: number,
        pageSize: number,
        searchTerm: string,
        sortColumn: string,
        sortDirection: 'asc' | 'desc'
    ): Observable<ApiResponse<ILectura[]>> {

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

        return this.http.get<ApiResponse<ILectura[]>>(`${this.apiUrl}/${END_POINT_SERVICE.GET_ALL_LECTURA}`).pipe(
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

    getLecturaById(id: number): Observable<ApiResponse<ILectura>> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<ApiResponse<ILectura>>(url).pipe(
            catchError(this.handleError)
        );
    }

    updateLectura(factura: ILectura): Observable<ApiResponse<ILectura>> {
            return this.http.post<ApiResponse<ILectura>>(this.apiUrl, factura).pipe(
                catchError(this.handleError)
            );
        }
    
}