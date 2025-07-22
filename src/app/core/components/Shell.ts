import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header';
import { Footer } from '@components/footer';
import { Toast } from '@shared/components/toast';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Toast],
  template: `
    <div class="app-shell">
      <app-header/>
      <main class="app-shell__main">
        <router-outlet/>
      </main>
      <app-footer/>
      <app-toast/>
    </div>
  `,
  styles: [`
    .app-shell {
      display: grid;
      min-height: 100vh;
      min-height: 100dvh;
      grid-template-rows: auto 1fr auto;
    }
    .app-shell__main { overflow-y: auto; }
  `],
})
export class AppShellComponent {}
