import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Buttoon } from "./button";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Buttoon, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <nav class="border-gray-200 bg-gray-50">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pr-4 pl-4">
      <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="images/logo_name.png" class="h-16" alt="multiAcueductos Logo" />
      </a>
      <button data-collapse-toggle="navbar-solid-bg" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-solid-bg" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
        <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
          <li>
           <app-button [routerLink]="'/auth/login'" routerLinkActive="router-link-active"  [class]="'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center '">Iniciar Sesion</app-button>
          </li>
          <li>
          <app-button [routerLink]="'/auth/'" routerLinkActive="router-link-active" [class]="'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'">Registrate</app-button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  `,
})
export class Header {}
