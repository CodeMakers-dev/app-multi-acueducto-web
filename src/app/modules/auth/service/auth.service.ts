import {
  Injectable, signal, computed, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.local';
import { END_POINT_SERVICE } from '../../../environments/environment.variables';
import { ApiResponse } from '@interfaces/Iresponse';
import { IAuthResponse, Iuser } from '@interfaces/Iuser';
import { mergeMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly tokenSig = signal<string | null>(null);
  private readonly userSig  = signal<Iuser | null>(null);

  readonly isLoggedIn = computed(() => !!this.tokenSig() && !!this.userSig());
  readonly user       = computed(() => this.userSig());

  // ——— endpoints ———
  private readonly loginUrl = `${environment.apiUrl}/${END_POINT_SERVICE.POST_AUTH_USER}`;
  private readonly userUrl  = `${environment.apiUrl}/${END_POINT_SERVICE.GET_USER}`;

  constructor() {
    if (this.isBrowser) {
      const tk = localStorage.getItem('token');
      const usr = localStorage.getItem('userObject');
      this.tokenSig.set(tk);
      this.userSig.set(usr ? JSON.parse(usr) : null);
      if (tk && !usr) this.fetchProfile().subscribe();
    }
  }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<IAuthResponse>>(this.loginUrl, { username: email, password })
      .pipe(
        mergeMap(res => {
          if (res.code !== 200 || !res.response) return of(res);

          const { token, usuario } = res.response;

          if (this.isBrowser) {
            localStorage.setItem('token', token);
            localStorage.setItem('userObject', JSON.stringify(usuario));
          }

          this.tokenSig.set(token);
          this.userSig.set(usuario);

          return of(res);
        })
      );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('userObject');
    }
    this.tokenSig.set(null);
    this.userSig.set(null);
    this.router.navigate(['/home']);
  }

  fetchProfile() {
    return this.http.get<ApiResponse<Iuser>>(this.userUrl).pipe(
      mergeMap(res => {
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
}
