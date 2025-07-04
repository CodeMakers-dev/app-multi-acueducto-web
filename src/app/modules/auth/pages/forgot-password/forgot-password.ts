import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Buttoon } from "../../../../shared/components/button";

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule, Buttoon],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

}
