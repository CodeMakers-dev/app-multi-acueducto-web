import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Buttoon } from "../../../../shared/components/button";
import { Link } from "../../../../shared/components/link";
import { AuthService } from '../../service/auth.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { Iuser } from '@interfaces/Iuser';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [RouterModule, Buttoon, Link, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  showPassword: boolean = false;
  username: string = '';
  password: string = '';

  constructor(
  private router: Router,
  private authService: AuthService
) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa ambos campos',
        confirmButtonColor: '#3388f5',
      });
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (resp: ApiResponse<Iuser>) => {
        if (resp.code === 200 && resp.response?.token) {
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido',
            text: 'Inicio de sesión exitoso',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/start/start']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: resp.message || 'Usuario o contraseña incorrectos',
            confirmButtonColor: '#d33',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'Error en la comunicación con el servidor',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

}
