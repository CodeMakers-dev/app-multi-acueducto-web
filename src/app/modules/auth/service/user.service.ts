import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";



@Injectable({
  providedIn: 'root',
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.POST_REC_PASS}`;
    
    protected readonly http= inject(HttpClient)

    recoverPassword(correo: string): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('correo', correo);
    return this.http.post<ApiResponse<any>>(this.apiUrl, null, { params });
  }
}
