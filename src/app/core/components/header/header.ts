import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Iuser } from '@interfaces/Iuser';
import { UserService } from '../../../modules/auth/service/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../modules/auth/service/auth.service';
import Swal from 'sweetalert2';

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
  mostrarMenu = false;


  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type.startsWith('image/')) {
        this.userService.updateUserImage(Number(this.usuario.id), file, this.usuario.nombre).subscribe({
          next: (resp) => {
            const nuevaImagen = resp.response?.imagenBase64;
            if (nuevaImagen) {
              this.usuario.imagen = nuevaImagen;
              this.imagenBase64 = `data:image/jpeg;base64,${nuevaImagen}`;
              localStorage.setItem('userObject', JSON.stringify(this.usuario));
              this.mostrarModal = false;

              Swal.fire({
                icon: 'success',
                title: 'Imagen actualizada',
                text: 'Tu imagen de perfil se ha actualizado exitosamente.',
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'Imagen no actualizada',
                text: 'No se recibió la nueva imagen desde el servidor.',
              });
            }
          },
          error: (err) => {
            console.error('Error al subir imagen', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al subir la imagen.',
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Archivo inválido',
          text: 'Por favor selecciona un archivo de imagen válido.',
        });
      }
    }
  }

}

