import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../modules/auth/service/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../modules/auth/service/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '@services/toast.service';
import { ILink } from '@interfaces/link/link';
import { Link } from '@shared/components/link';
import { BreadcrumbComponent } from "./breadcrumb";

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, Link, BreadcrumbComponent],
 // ...existing code...
template: `
  <nav class="bg-white shadow-md border-b border-gray-300">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      @if (isAuth()) {
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            @for (item of linkListHeader; track $index) {
              <li>
                <app-link
                  [link]="item.link"
                  class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                  {{ item.name }}
                </app-link>
              </li>
            }
          </ul>
        </div>
      } @else {
        <div></div>
      }
      <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        @if (isAuth()) {
          <button
            type="button"
            class="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom">
            <span class="sr-only">Open user menu</span>
            <img
              class="h-8 w-8 rounded-full"
              alt="user photo" />
          </button>
          <div
            class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm"
            id="user-dropdown">
            <div class="px-4 py-3">
              <!-- <span class="block text-sm text-gray-900">{{ usuario?.nombre }}</span>
              <span class="block text-sm text-gray-500 truncate">{{ usuario?.email }}</span> -->
            </div>
            <ul>
              @for (item of linkList; track $index) {
                <li>
                  <app-link
                    [link]="item.link"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {{ item.name }}
                  </app-link>
                </li>
              }
              <li>
                <button
                (click)="authService.logout()"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>

          <button
            data-collapse-toggle="navbar-user"
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-user"
            aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        } @else {
          <div class="flex items-center space-x-2">
            <app-link
              [link]="'/auth/login'"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Iniciar Sesión
            </app-link>
            <app-link
              [link]="'/auth/register'"
              class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Registrarse
            </app-link>
          </div>
        }
      </div>
    </div>
  </nav>
  @if (isAuth()) {
    <app-breadcrumb></app-breadcrumb>
  }
`,
})
export class Header  {

 public authService = inject(AuthService);

 readonly isAuth = this.authService.isLoggedIn;
 readonly user = this.authService.user;


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
      name: 'CLientes',
      link: '/client',
      target: '_self',
    },
    {
      name: 'Facturas',
      link: '/services',
      target: '_self',
    },
    {
      name: 'Lecturas',
      link: '/contact',
      target: '_self',
    },
    {
      name: 'Empleados',
      link: '/about',
      target: '_self',
    },
        {
      name: 'Contadores',
      link: '/about',
      target: '_self',
    }
  ];

  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly userService = inject(UserService);

}
