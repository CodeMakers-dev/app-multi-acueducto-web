import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Toast } from '@shared/components/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Toast],
  template: `
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  `,
})
export class App implements OnInit {
  constructor(
    private readonly flowbiteService: FlowbiteService,
    private readonly router: Router
  ) {}

  title = 'app-multi-acueductos';

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    // ← SOLO AGREGAR ESTAS LÍNEAS
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => initFlowbite(), 100);
      }
    });
  }
}
