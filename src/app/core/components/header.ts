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
<nav
  [ngClass]="{
    'shadow-lg border-gray-300 dark:border-gray-800': isScrolled,
    'border-transparent': !isScrolled
  }"
  class="fixed top-0 left-0 right-0 z-[9999] bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border-b transition-all duration-300"
>
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2.5">

    @if (isAuth()) {
      <div id="navbar-user" class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
        <ul
          class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 dark:border-gray-800
                 rounded-lg bg-gray-50 dark:bg-gray-800/30 md:space-x-8 rtl:space-x-reverse
                 md:flex-row md:mt-0 md:border-0 md:bg-transparent md:dark:bg-transparent"
        >
          @for (item of linkListHeader; track $index) {
            <button
              [routerLink]="item.link"
              class="overflow-hidden relative w-32 p-2 h-12 bg-transparent
                     text-gray-700 dark:text-gray-200 border-none rounded-md text-xl font-bold
                     cursor-pointer relative z-10 group flex items-center justify-center"
            >
              {{ item.name }}
              <span
                class="absolute w-36 h-32 -top-8 -left-2 bg-gray-400 dark:bg-gray-500/70
                       rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform
                       group-hover:duration-500 duration-1000 origin-left"></span>
              <span
                class="absolute w-36 h-32 -top-8 -left-2 bg-gray-800 dark:bg-gray-700
                       rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform
                       group-hover:duration-700 duration-700 origin-left"></span>
              <span
                class="absolute w-36 h-32 -top-8 -left-2 bg-gray-900 dark:bg-gray-900
                       rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform
                       group-hover:duration-1000 duration-500 origin-left"></span>
              <span
                class="text-white group-hover:opacity-100 group-hover:duration-1000
                       duration-100 opacity-0 absolute inset-0 flex items-center justify-center z-10">
                {{ item.name }}
              </span>
            </button>
          }
        </ul>
      </div>
    } @else {
      <div></div>
    }

    <div class="flex items-center md:order-2 gap-2 md:space-x-0 rtl:space-x-reverse">

      <button id="theme-toggle" type="button"
        class="text-gray-500 dark:text-gray-400 inline-flex items-center justify-center
               hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4
               focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        aria-label="Toggle dark mode">
        <svg id="theme-toggle-dark-icon" class="w-5 h-5 hidden" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
        <svg id="theme-toggle-light-icon" class="w-5 h-5" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"/>
        </svg>
        <span class="sr-only">Toggle dark mode</span>
      </button>

      @if (isAuth()) {
        <button
          id="dropdownAvatarNameButton"
          data-dropdown-toggle="dropdownAvatarName"
          class="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
          type="button"
        >
          <span class="sr-only">Open user menu</span>
          <img class="w-8 h-8 me-2 rounded-full object-cover" [src]="avatarSrc()" alt="user photo">
          <span *ngIf="user() as u">{{ u.persona.nombre }} {{ u.persona.apellido }}</span>
          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
        </button>

        <div id="dropdownAvatarName" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
          <div class="px-4 py-3 text-sm text-gray-900 dark:text-white" *ngIf="user() as u">
            <div class="font-medium">{{ u.persona.nombre }} {{ u.persona.apellido }}</div>
            <div class="truncate">{{ u.persona.correo }}</div>
          </div>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownAvatarNameButton">
            @for (item of linkList; track $index) {
              <li>
                <app-link
                  [link]="item.link"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {{ item.name }}
                </app-link>
              </li>
            }
          </ul>
          <div class="py-2">
            <button
              (click)="authService.logout()"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <button
          type="button"
          data-collapse-toggle="navbar-user"
          aria-controls="navbar-user"
          aria-expanded="false"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm
                 text-gray-500 dark:text-gray-400 rounded-lg md:hidden
                 hover:bg-gray-100 dark:hover:bg-gray-700
                 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
        >
          <span class="sr-only">Abrir menú principal</span>
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

      } @else {
        <div class="flex items-center space-x-2">
          <app-link
            [link]="'/auth/login'"
            class="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 text-sm font-medium"
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



@if (isAuth()) {
  <!-- <app-breadcrumb></app-breadcrumb> -->
}

`,
})
export class Header  {

  public readonly authService = inject(AuthService);
  private readonly sanitizer   = inject(DomSanitizer);
  private readonly router      = inject(Router);
  private readonly toast       = inject(ToastService);
  private readonly userService = inject(UserService);
  readonly isAuth = this.authService.isLoggedIn;
  readonly user = this.authService.user as Signal<Iuser | null>;
  readonly avatarSrc = signal<SafeUrl>('assets/img/avatar-default.png');

  constructor() {
    effect(() => {
      const u = this.user();
      if (!u) return;

      const img = u.imagen;
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

  private bytesToDataURL(bytes: number[]): string {
    const blob   = new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' });
    const reader = new FileReader();
    return new Promise<string>((res) => {
      reader.onloadend = () => res(reader.result as string);
      reader.readAsDataURL(blob);
    }) as unknown as string;
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
