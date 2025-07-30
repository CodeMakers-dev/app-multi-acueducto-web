import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-Welcome',
  standalone: true,
  template: `
    <section class="pt-5 py-12 lg:py-10 bg-transparent">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
})
export class Welcome {}
