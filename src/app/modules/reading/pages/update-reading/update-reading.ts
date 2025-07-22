import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Navigation } from "@components/navigation/navigation";
import { ILectura } from '@interfaces/Ifactura';
import { LecturaService } from '../../service/lectura.service';

@Component({
  selector: 'app-update-reading',
  imports: [CommonModule, FormsModule, Navigation],
  templateUrl: './update-reading.html',
  providers: [DatePipe]
})
export class UpdateReading implements OnInit {
  
  lectura: ILectura | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly lecturaService = inject(LecturaService);

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.lecturaService.getLecturaById(id).subscribe({
        next: (res) => {
          const lectura = res.response;
          this.lectura = {
            ...lectura,
            fechaLectura: lectura.fechaLectura ? this.formatDateToInput(lectura.fechaLectura) : ''
           
          };
        },
        error: (err) => {
          console.error('Error cargando factura:', err);
        }
      });
    }
  }

  onSubmit(): void {
  console.log('Submit ejecutado');
  console.log('Lectura antes de enviar:', this.lectura);

  if (this.lectura) {
    this.lectura.fechaLectura = this.formatDateToString(this.lectura.fechaLectura);
    this.lecturaService.updateLectura(this.lectura).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('Lectura actualizada correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar la lectura:', err);
        alert('Error al actualizar la lectura');
      }
    });
  } else {
    console.warn('No hay lectura cargada');
  }
}
  private formatDateToInput(fecha: string | Date): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

 private formatDateToString(date: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

}
