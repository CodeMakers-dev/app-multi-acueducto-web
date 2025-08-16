import { RouterLink } from '@angular/router';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Link } from "@shared/components/link";

@Component({
  selector: 'app-Welcome',
  standalone: true,
  template: `
    <section class="pt-5 py-12 lg:py-10 bg-transparent">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-end space-x-2 mb-4">
  <app-link
            [link]="'/auth/login'"
            class="text-gray-700 dark:text-gray-200 hover:text-blue-600 px-3 py-2 text-sm font-medium"
          >
            Iniciar Sesión
          </app-link>
          <app-link
    [link]="'/auth/register'"
    class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
  >
    Registrarse
  </app-link>
        </div>
        <div class="flex items-center mb-8 lg:mb-2">
          <div
            class="w-12 h-12 bg-blue-500 rounded-full mr-4 flex items-center justify-center"
          >
            <span class="text-white font-bold text-lg">CM</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-900">CodeMakers SAS</h2>
        </div>
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <p class="text-sm uppercase tracking-wide text-gray-500 mb-4">
              SOFTWARE SERVICIOS E INVENTARIOS
            </p>
            <h1
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Ofrece tus servicios y controla tus negocio con CodeMakers
            </h1>
            <p class="text-lg text-gray-600 leading-relaxed mb-8">
              La forma más fácil de vender y facturar electrónicamente,
              cumpliendo con la DIAN de manera automática.
            </p>
            <button
              class="bg-[linear-gradient(182deg,_rgba(3,53,152,1)_0%,_rgba(41,117,225,1)_100%)] text-white p-2 rounded-lg"
            >
              Conoce más
            </button>
          </div>
          <div class="order-first lg:order-last">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <img
                  src="images/home/home_image.png"
                  alt="1"
                  class="w-full h-auto "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Link],
})
export class Welcome {}
