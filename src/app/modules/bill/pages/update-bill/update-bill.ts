import { Component, inject, OnInit } from '@angular/core';
import { Header } from "@components/header/header";
import { Footer } from "@components/footer/footer";
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from '../../service/factura.service';
import { IFactura } from '@interfaces/Ifactura';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-bill',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './update-bill.html',
  styleUrl: './update-bill.css',
  providers: [DatePipe]
})
export class UpdateBill implements OnInit {
  factura: IFactura | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly facturaService = inject(FacturaService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.facturaService.getFacturaById(id).subscribe({
        next: (res) => {
          this.factura = res.response;
        },
        error: (err) => {
          console.error('Error cargando factura:', err);
        }
      });
    }
  }
}
