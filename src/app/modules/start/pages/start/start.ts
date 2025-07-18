import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [RouterModule],
  templateUrl: './start.html',
  styleUrl: './start.css'
})
export class Start implements OnInit {
  nombreUsuario = 'Juan Pérez';
  consumoMesActual = 14.7; // puedes traerlo desde un servicio
  valorFactura = 58200; // en pesos
  fechaLimitePago = '15 de Julio de 2025';

  ngOnInit(): void {
    // Aquí puedes obtener los datos desde un servicio real
  }
}
