import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { Buttoon } from "../../../../shared/components/button";
import { Link } from "../../../../shared/components/link"; 
@Component({
  selector: 'app-login',
  imports: [RouterModule, Buttoon, Link],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

}
