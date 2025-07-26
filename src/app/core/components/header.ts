import { Component, effect, HostListener, inject, signal, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../modules/auth/service/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../modules/auth/service/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@services/toast.service';
import { ILink } from '@interfaces/link/link';
import { Link } from '@shared/components/link';
import { BreadcrumbComponent } from "./breadcrumb";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Iuser } from '@interfaces/Iuser';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, Link, BreadcrumbComponent, RouterLink],
  template: `
<!-- header.component.html -->
<nav
  [ngClass]="{
    'shadow-lg border-gray-300': isScrolled,
    'border-transparent': !isScrolled
  }"
  class="fixed top-0 left-0 right-0 z-[9999] bg-white/10 backdrop-blur-md border-b transition-all duration-300"
>
  <div
    class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2.5"
  >

    @if (isAuth()) {
      <div
        id="navbar-user"
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
      >
        <ul
          class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent"
        >
          @for (item of linkListHeader; track $index) {
            <!-- From Uiverse.io by Javierrocadev -->

                <button
                  [routerLink]="item.link"
                  class="overflow-hidden relative w-32 p-2 h-12 bg-transparent text-gray-700 border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group flex items-center justify-center"
                >
                 {{ item.name }}
                  <span
                    class="absolute w-36 h-32 -top-8 -left-2 bg-gray-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"
                  ></span>
                  <span
                    class="absolute w-36 h-32 -top-8 -left-2 bg-gray-800 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"
                  ></span>
                  <span
                    class="absolute w-36 h-32 -top-8 -left-2 bg-gray-900 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"
                  ></span>
                  <span
                    class="text-white group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute inset-0 flex items-center justify-center z-10">
                    {{ item.name }}
                  </span>
                </button>



            <!-- <li>
              <app-link
                [link]="item.link"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >
                {{ item.name }}
              </app-link>
            </li> -->
          }
        </ul>
      </div>
    } @else {
      <div></div>
    }

    <!-- Sección derecha (avatar, menú y botones) -->
    <div
      class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
    >
      @if (isAuth()) {
        <!-- Botón avatar -->
        <button
          type="button"
          id="user-menu-button"
          data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom"
          aria-expanded="false"
          class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
        >
          <span class="sr-only">Abrir menú de usuario</span>
          <img
            class="h-12 w-12 rounded-full object-cover"
            [src]="avatarSrc()"
            alt="avatar"
          />
        </button>

        <!-- Dropdown -->
        <div
          id="user-dropdown"
          class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm"
        >
          <!-- Info de usuario -->
          <div class="px-4 py-3" *ngIf="user() as u">
            <span class="block text-sm font-medium text-gray-900">
              {{ u.persona.nombre }} {{ u.persona.apellido }}
            </span>
            <span class="block text-sm text-gray-500 truncate">
              {{ u.persona.correo }}
            </span>
          </div>

          <!-- Links secundarios -->
          <ul>
            @for (item of linkList; track $index) {
              <li>
                <app-link
                  [link]="item.link"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {{ item.name }}
                </app-link>
              </li>
            }
            <li>
              <button
                (click)="authService.logout()"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>

        <!-- Botón hamburguesa (mobile) -->
        <button
          type="button"
          data-collapse-toggle="navbar-user"
          aria-controls="navbar-user"
          aria-expanded="false"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <span class="sr-only">Abrir menú principal</span>
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      } @else {
        <!-- Botones de login / registro cuando no hay sesión -->
        <div class="flex items-center space-x-2">
          <app-link
            [link]="'/auth/login'"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
          >
            Iniciar Sesión
          </app-link>
          <app-link
            [link]="'/auth/register'"
            class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Registrarse
          </app-link>
        </div>
      }
    </div>
  </div>
</nav>

<!-- Migas de pan (solo autenticado) -->
@if (isAuth()) {
  <app-breadcrumb></app-breadcrumb>
}

`,
})
export class Header  {

  /* ─── DI ─── */
  public readonly authService = inject(AuthService);
  private readonly sanitizer   = inject(DomSanitizer);
  private readonly router      = inject(Router);
  private readonly toast       = inject(ToastService);
  private readonly userService = inject(UserService);

  /* ─── Signals ─── */
  /** ¿Está autenticado? → ya lo tenías */
  readonly isAuth = this.authService.isLoggedIn;          // signal<boolean>

  /** Usuario completo */
  // 1️⃣  Si `authService.user` YA es signal, simplemente:
  readonly user = this.authService.user as Signal<Iuser | null>;

  /* 2️⃣  Si fuera un Observable (ej. BehaviorSubject) haz:
  readonly user = toSignal(this.authService.user$, { initialValue: null });
  */

  /** Avatar listo para <img> */
  readonly avatarSrc = signal<SafeUrl>('assets/img/avatar-default.png');

  constructor() {
    /* Actualiza el avatar cada vez que cambie el usuario */
    effect(() => {
      const u = this.user();
      if (!u) return;

      const img = u.imagen;                      // ajusta al nombre real del campo
      let dataUrl = 'assets/img/avatar-default.png';

      if (Array.isArray(img)) {
        dataUrl = this.bytesToDataURL(img);
      } else if (typeof img === 'string') {
        dataUrl = img.startsWith('data:')
          ? img
          : `data:image/jpeg;base64,${img}`;
      }

      this.avatarSrc.set(this.sanitizer.bypassSecurityTrustUrl(dataUrl));
    });
  }

  /** Convierte un array de bytes en dataURL base64 */
  private bytesToDataURL(bytes: number[]): string {
    const blob   = new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' });
    const reader = new FileReader();
    return new Promise<string>((res) => {
      reader.onloadend = () => res(reader.result as string);
      reader.readAsDataURL(blob);
    }) as unknown as string; // cast porque la Promise es async, pero effect admite
  }

  linkList: ILink[] = [
    {
      name: 'Inicio',
      link: '/home',
      target: '_self',
    },
    {
      name: 'Servicios',
      link: '/services',
      target: '_self',
    },
    {
      name: 'Contacto',
      link: '/contact',
      target: '_self',
    },
    {
      name: 'Acerca de',
      link: '/about',
      target: '_self',
    },
  ];

  linkListHeader: ILink[] = [
    {
      name: 'Clientes',
      link: '/client',
      target: '_self',
    },
    {
      name: 'Facturas',
      link: '/bill',
      target: '_self',
    },
    {
      name: 'Lecturas',
      link: '/reading',
      target: '_self',
    },
    {
      name: 'Empleados',
      link: '/employee',
      target: '_self',
    },
        {
      name: 'Contadores',
      link: '/counter',
      target: '_self',
    }
  ];

      isScrolled = false;

    @HostListener('window:scroll', [])
    onWindowScroll(): void {
      this.isScrolled = window.scrollY > 0;
    }


}
