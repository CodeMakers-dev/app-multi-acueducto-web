import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Iuser } from '@interfaces/Iuser';
import { UserService } from '../../../modules/auth/service/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../modules/auth/service/auth.service';

@Component({
  selector: 'app-header-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  usuario!: Iuser;
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const user = this.authService.getUser();
      if (user) {
        this.usuario = user;
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  cerrarSesion(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/auth/login']);
  }
}

