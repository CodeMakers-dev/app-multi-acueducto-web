import { Component, inject } from '@angular/core';
import { Buttoon } from "../../../../shared/components/button";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover-password',
  imports: [ReactiveFormsModule, Buttoon, CommonModule,],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css'
})
export class RecoverPassword {
   showPassword: boolean = false;
   showConfirmPassword: boolean = false;
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form: FormGroup;
  token: string = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  constructor() {
    this.form = this.fb.group({
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_.])[A-Za-z\d@$!%*?&\-_.]{8,}$/)
  ]],
  confirmPassword: ['', Validators.required],
});

    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
     
    });
  }

  onSubmit(): void {
  const { password, confirmPassword } = this.form.value;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_.])[A-Za-z\d@$!%*?&\-_.]{8,}$/;
  if (!passwordRegex.test(password)) {
    Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un carácter especial.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    return;
  }

  this.userService.updatePasswordByToken(this.token, password).subscribe({
    next: res => {
      if (res.success) {
        Swal.fire('Éxito', res.message, 'success').then(() => {
          this.router.navigate(['/auth/login']);
        });
      } else {
        Swal.fire('Error', res.message, 'error');
      }
    },
    error: err => {
      console.error(err);
      Swal.fire('Error', 'Error actualizando contraseña', 'error');
    }
  });
}

}
