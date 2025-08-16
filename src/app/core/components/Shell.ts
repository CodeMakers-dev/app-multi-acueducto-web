import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header';
import { Footer } from '@components/footer';
import { Toast } from '@shared/components/toast';
import { SidebarComponent } from './sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Toast, SidebarComponent],
  template: `
    <div class="app-shell">
      <div class="app-shell__background"></div>
      <app-sidebar
        (sidebarStateChange)="sidebarState.set($event)"
      ></app-sidebar>
      <div
        class="app-shell__content transition-all duration-300 ease-in-out"
        [class.ml-64]="!sidebarState().isMobile && sidebarState().isExpanded"
        [class.ml-16]="!sidebarState().isMobile && !sidebarState().isExpanded"
        [class.ml-0]="sidebarState().isMobile"
      >
        <app-header class="relative z-30" />
        <main
          class="app-shell__main pt-10 bg-white dark:bg-gray-900 relative z-10"
        >
          <router-outlet />
        </main>
        <app-footer />
      </div>
      <app-toast />
    </div>
  `,
  styles: [
    `
      .app-shell {
        position: relative;
        min-height: 100vh;
        min-height: 100dvh;
        width: 100%;
        overflow-x: hidden; 
      }

      .app-shell__background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background: radial-gradient(
          125% 125% at 50% 10%,
          #fff 40%,
          #6366f1 100%
        );
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
      }

      @media (max-width: 1023px) {
        .app-shell__content {
          margin-left: 0 !important;
        }
      }
    `,
  ],
})
export class AppShellComponent {
  sidebarState = signal({
    isExpanded: false,
    isMobile: true,
  });

  contentMargin = computed(() => {
    const state = this.sidebarState();
    if (state.isMobile) return 'ml-0';
    return state.isExpanded ? 'ml-64' : 'ml-16';
  });
}
