import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Toast } from "@shared/components/toast";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Toast],
  template: ` <router-outlet /> <app-toast></app-toast>
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
