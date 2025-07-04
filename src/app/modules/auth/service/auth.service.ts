import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.local";
import { END_POINT_SERVICE } from "../../../environments/environment.variables";
import { HttpClient } from "@angular/common/http";
import { mergeMap, Observable, of } from "rxjs";
import { ApiResponse } from "@interfaces/Iresponse";
import { Iuser } from "@interfaces/Iuser";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/${END_POINT_SERVICE.POST_AUTH_USER}`;

    constructor(private http: HttpClient, private router: Router) {}

    login(nombre: string, contrasena: string): Observable<ApiResponse<Iuser>> {
    const body = { username: nombre, contrasena };

    return this.http.post<ApiResponse<Iuser>>(this.apiUrl, body).pipe(
      mergeMap((response: ApiResponse<Iuser>) => {
        if (response.code === 200 && response.response) {
          const user = response.response;

          localStorage.setItem('userObject', JSON.stringify(user));
          if (user.token) {
            localStorage.setItem('token', user.token);
          }
          return of(response);
        } else {
          return of(response);
        }
      })
    );
  }
  getUser(): Iuser | null {
    const user = localStorage.getItem('userObject');
    return user ? JSON.parse(user) as Iuser : null;
  }
}
