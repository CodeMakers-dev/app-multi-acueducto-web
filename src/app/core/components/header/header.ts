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
  imagenBase64: string = '';
  mostrarModal = false;


  private router = inject(Router);
  private authService = inject(AuthService);

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.usuario = user;
      console.log('usuario:', this.usuario);

      if (Array.isArray(this.usuario.imagen)) {
        this.convertirImagenBytesABase64(this.usuario.imagen);
      } else if (typeof this.usuario.imagen === 'string') {
        this.imagenBase64 = `data:image/jpeg;base64,${this.usuario.imagen}`;
      } else {
        this.imagenBase64 = 'assets/img/avatar-default.png';
      }

    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  convertirImagenBytesABase64(imagenBytes: number[]): void {
    const typedArray = new Uint8Array(imagenBytes);
    const blob = new Blob([typedArray], { type: 'image/jpeg' });
    const reader = new FileReader();

    reader.onloadend = () => {
      this.imagenBase64 = reader.result as string;
    };

    reader.readAsDataURL(blob);
  }
  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}

