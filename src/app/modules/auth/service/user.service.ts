import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { Iuser } from "@interfaces/Iuser";



@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_USER}`;
  protected readonly http = inject(HttpClient);


  recoverPassword(correo: string): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('correo', correo);
    const url = `${this.apiUrl}/${END_POINT_SERVICE.POST_REC_PASS}`;
    return this.http.post<ApiResponse<any>>(url, null, { params });
  }

  updatePasswordByToken(token: string, contrasena: string): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/${END_POINT_SERVICE.POST_UPD_PASS}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };
    const body = { contrasena };
    return this.http.post<ApiResponse<any>>(url, body, { headers });
  }


  getUserById(id: number): Observable<ApiResponse<Iuser>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ApiResponse<Iuser>>(url);
  }
}
