import { Component } from '@angular/core';
import { Header } from '@shared/components/header';
import { Footer } from '@components/footer';
import { Welcome } from '@components/welcome';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, Welcome],
  template: `
    <app-header></app-header>
    <app-Welcome></app-Welcome>
    <app-footer></app-footer>
    <!-- @defer (on viewport) {
    
    }@placeholder {
    <div style="height: 1000px; background-color: lightblue;">
      <p>Loading...</p>
    </div>
    } -->
  `,
})
export class Home {}
