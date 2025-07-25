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
      <!-- Radial Gradient Background -->
      <div class="app-shell__background"></div>

      <!-- Content -->
      <div class="app-shell__content">
        <app-header/>
        <main class="app-shell__main">
          <router-outlet/>
        </main>
        <app-footer/>
      </div>

      <app-toast/>
    </div>
  `,
styles: [`
    .app-shell {
      position: relative;
      min-height: 100vh;
      min-height: 100dvh;
      width: 100%;
    }

    .app-shell__background {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%);
    }

    .app-shell__content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
    }

    .app-shell__main {
      flex: 1;
      min-height: 100vh;
      min-height: 100dvh;
      background: transparent;
    }
  `],
})
export class AppShellComponent {}
