import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Buttoon } from './button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Buttoon, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="border-gray-200 bg-gray-50">
      <div
        class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pr-4 pl-4 py-3" >
        <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="images/logo_name.png" class="h-20 w-auto" alt="multiAcueductos Logo" /> </a>

        <div class="flex items-center space-x-2 sm:space-x-4"> <app-button
              [routerLink]="'/auth/login'"
              routerLinkActive="router-link-active"
              [class]="
                'text-white bg-[linear-gradient(182deg,_rgba(3,53,152,1)_0%,_rgba(41,117,225,1)_100%)] cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center whitespace-nowrap'
              "
              >Iniciar Sesion</app-button
            >
            <app-button
              [routerLink]="'/auth/register'"
              routerLinkActive="router-link-active"
              [class]="
                'text-white bg-[linear-gradient(182deg,_rgba(3,53,152,1)_0%,_rgba(41,117,225,1)_100%)] cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 text-center whitespace-nowrap'
              "
              >Registrarse</app-button
            >
        </div>
      </div>
    </nav>
  `,
})
export class Header { }
