import { inject, Inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { mergeMap, Observable, of } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { IAuthResponse, Iuser } from "@interfaces/Iuser";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.POST_AUTH_USER}`;
  private baseUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_USER}`;

  protected readonly router = inject(Router)
  protected readonly http = inject(HttpClient)

  login(username: string, password: string): Observable<ApiResponse<IAuthResponse>> {
    const body = { username: username, password };

    return this.http.post<ApiResponse<IAuthResponse>>(this.apiUrl, body).pipe(
      mergeMap((response: ApiResponse<IAuthResponse>) => {
        if (response.code === 200 && response.response) {
          const authData = response.response;
          const user = authData.usuario;

          localStorage.setItem('userObject', JSON.stringify(user));
          if (user.token) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('userId', String(user.id));
            localStorage.setItem('userName', user.nombre || '');
            localStorage.setItem('userImagen', user.imagen || '');
          }
          return of(response);
        } else {
          return of(response);
        }
      })
    );
  }
  getUser(): Iuser | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('userObject');
      return user ? JSON.parse(user) as Iuser : null;
    }
    return null;
  }

}
