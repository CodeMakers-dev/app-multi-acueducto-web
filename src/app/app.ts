import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  template: ` <router-outlet />
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
  }
}
