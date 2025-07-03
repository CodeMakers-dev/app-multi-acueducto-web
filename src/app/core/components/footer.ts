import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IImage } from '@interfaces/image/image';
import { ILink } from '@interfaces/link/link';
import { Image } from '@shared/components/image';

@Component({
  selector: 'app-footer',
  imports: [Image],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500">
      <div
        class="max-w-screen-lg py-10 px-4 pb-0 pt-0 sm:px-6 text-white sm:flex justify-between mx-auto">
        <div class="w-full text-center py-8">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Multi Acueductos
          </h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8">
            Servicios que simplifican tu vida
          </p>
          <nav class="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-12">
            @for (item of linkList; track $index) {
              <a [href]="item.link" [target]="item.target"
                class="text-white hover:text-blue-200 transition-colors duration-300">
                {{ item.name }}
              </a>
            }
          </nav>
        </div>
      </div>
      <div
        class="flex py-5 m-auto text-gray-800 text-sm flex-col items-center border-t border-white max-w-screen-xl">
        <div
          class="md:flex-auto md:flex-row-reverse mt-2 flex-row flex gap-[2.5rem]">
        @for (item of sociaMediaList; track $index) {
          <a [href]="item.link" class="flex items-center gap-2">
            <app-image [images]="item" [class]="'object-contain'"></app-image>
          </a>
        }
        </div>
        <div class="my-5 text-amber-50">
          2025 Multi Acueductos. Todos los derechos reservados
        </div>
      </div>
    </footer>
  `,
})
export class Footer {

linkList : ILink[] = [
  {
    name: 'Inicio',
    link: '/home',
    target: '_self'
  },
  {
    name: 'Servicios',
    link: '/services',
    target: '_self'
  },
  {
    name: 'Contacto',
    link: '/contact',
    target: '_self'
  },
  {
    name: 'Acerca de',
    link: '/about',
    target: '_self'
  }
]

sociaMediaList: IImage[] = [
  {
    name: 'instagram',
    link: '',
    imgPath: 'images/IconF.png',
    width: 32,
    height: 32
  },
  {
    name: 'facebook',
    link: 'https://www.facebook.com/login.php?next=https%3A%2F%2Fwww.facebook.com%2Ffriends%2F%3Flocale%3Des_LA',
    imgPath:  'images/IconI.png',
    width: 32,
    height: 32
  },
  {
    name: 'whatsapp',
    link: '',
    imgPath: 'images/IconW.png',
    width: 32,
    height: 32
  },
  {
    name: 'email',
    link: '',
    imgPath: 'images/Subtract.png',
    width: 32,
    height: 32
  }
];

}
