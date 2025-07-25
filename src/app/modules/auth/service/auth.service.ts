import { Injectable, signal, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.local';
import { END_POINT_SERVICE } from '../../../environments/environment.variables';
import { ApiResponse } from '@interfaces/Iresponse';
import { IAuthResponse, Iuser } from '@interfaces/Iuser';
import { catchError, map, mergeMap, Observable, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly apiUrl = environment.apiUrl;

  private readonly tokenSig = signal<string | null>(null);
  private readonly userSig = signal<Iuser | null>(null);
  private readonly enterpriseIdSig = signal<number | null>(null);

  readonly isLoggedIn = computed(() => !!this.tokenSig() && !!this.userSig());
  readonly user = computed(() => this.userSig());
  readonly enterpriseId = computed(() => this.enterpriseIdSig());

  private readonly loginUrl = `${environment.apiUrl}/${END_POINT_SERVICE.POST_AUTH_USER}`;
  private readonly userUrl = `${environment.apiUrl}/${END_POINT_SERVICE.GET_USER}`;

  constructor() {
    if (this.isBrowser) {
      const tk = localStorage.getItem('token');
      const usr = localStorage.getItem('userObject');
      const enterpriseId = localStorage.getItem('enterpriseId');
      this.tokenSig.set(tk);
      this.userSig.set(usr ? JSON.parse(usr) : null);
      this.enterpriseIdSig.set(enterpriseId ? +enterpriseId : null);
      if (tk && !usr) this.fetchProfile().subscribe();
    }
  }

 login(email: string, password: string) {
  return this.http
    .post<ApiResponse<IAuthResponse>>(this.loginUrl, {
      username: email,
      password,
    })
    .pipe(
      mergeMap((res: ApiResponse<IAuthResponse>) => {
        if (res.code !== 200 || !res.response) {
          return of(res);
        }

        const { token, usuario } = res.response;

        if (this.isBrowser) {
          localStorage.setItem('token', token);
          console.log('Token almacenado:', token);
          localStorage.setItem('userObject', JSON.stringify(usuario));
          console.log('Usuario almacenado:', usuario);
          localStorage.setItem('userId', usuario.id ? usuario.id.toString() : ''); 
          console.log('ID de usuario almacenado:', usuario.id);
        }

        this.tokenSig.set(token);
        this.userSig.set(usuario);

        if (usuario.id) {
          return this.getByIdEnterprise(+usuario.id).pipe(
            tap((enterpriseId: number | null) => {
              if (this.isBrowser) {
                if (enterpriseId) {
                  localStorage.setItem('enterpriseId', enterpriseId.toString());
                  console.log('Enterprise ID almacenado:', enterpriseId);
                } else {
                  console.log('Usuario no está asociado a una empresa');
                  localStorage.removeItem('enterpriseId');
                }
              }

              this.enterpriseIdSig.set(enterpriseId ?? null);
            }),
            map(() => res)
          );
        }

        return of(res);
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
}




  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('userObject');
      localStorage.removeItem('enterpriseId');
    }
    this.tokenSig.set(null);
    this.userSig.set(null);
    this.enterpriseIdSig.set(null);
    this.router.navigate(['/home']);
  }

 getByIdEnterprise(userId: number): Observable<number> {
  return this.http.get<any>(`${this.apiUrl}/${END_POINT_SERVICE.GET_ENTERPRISE}/${userId}`)
    .pipe(
      map((res) => res.response.idEmpresa)  
    );
}

  getUser() {
    return this.userSig();
  }

  fetchProfile() {
    return this.http.get<ApiResponse<Iuser>>(this.userUrl).pipe(
      mergeMap((res) => {
        if (res.code === 200 && res.response) {
          if (this.isBrowser) {
            localStorage.setItem('userObject', JSON.stringify(res.response));
          }
          this.userSig.set(res.response);
        }
        return of(res);
      })
    );
  }

  // // Método adicional para obtener enterprise ID manualmente si es necesario => solo para el debug mi pez o forzarlo
   getEnterpriseId(): number | null {
     return this.enterpriseIdSig();
   }
}
