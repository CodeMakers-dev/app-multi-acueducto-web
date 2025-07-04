import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-login',
  imports: [ RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

}
