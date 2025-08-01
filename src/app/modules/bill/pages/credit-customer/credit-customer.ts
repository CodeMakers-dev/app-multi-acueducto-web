import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbonoService } from '../../service/abono.service';
import { ApiResponse } from '@interfaces/Iresponse';
import { IAbonoFactura } from '@interfaces/IdeudaFactura';
import { TableComponent } from '@components/table';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-credit-customer',
  imports: [ CommonModule, TableComponent, RouterModule],
  template: `
  
    <app-table-dynamic
        [title]="title()"
        [datasource]="creditCustomerData()"
        [columns]="creditCustomerColumns()"
      />
  `,

})
export class CreditCustomer {

  creditCustomerColumns = signal([
    { field: 'nombreCliente', header: 'Cliente' },
    { field: 'codigoFactura', header: 'Código Factura' },
    { field: 'fechaAbono', header: 'Fecha Abono' },
    { field: 'valorAbono', header: 'Valor Abono' },
  ]);
  creditCustomerData = computed(() => this.dataCreditCustomer.value() ?? []);
  title = signal('Abono Facturas');

  tableData: any[] = [];

  protected readonly abonoService = inject(AbonoService);


  constructor() {
    effect(() => {
      console.log(
        'Data loaded______:',
        this.dataCreditCustomer.value()
      );
    });
  }

  dataCreditCustomer = rxResource({
  stream: () =>
    this.abonoService.getAllAbono().pipe(
      map((apiRes: ApiResponse<IAbonoFactura[]>) =>
        apiRes.response.map(abono => {
          const cliente = abono.deudaCliente.empresaClienteContador.cliente;

          const fullName = [
            cliente.nombre || '',
            cliente.segundoNombre || '',
            cliente.apellido || '',
            cliente.segundoApellido || ''
          ].filter(Boolean).join(' ');

          const fechaAbono = new Date(abono.fechaCreacion);

          return {
            id: abono.id,
            nombreCliente: fullName,
            codigoFactura: abono.deudaCliente.factura || 'Sin código',
            fechaAbono: fechaAbono.toLocaleDateString('es-CO'),
            valorAbono: `$${Number(abono.valor).toLocaleString()}`
          };
        })
      )
    )
});



  // loadAbono(): void {
  //   this.abonoService.getAllAbono(
  //   ).subscribe(
  //     (apiResponse: ApiResponse<IAbonoFactura[]>) => {
  //       const abonos = apiResponse.response;

  //       const abonosTransformados = abonos.map(abono => {
  //         const valorDeuda = abono.deudaCliente?.valor || '0';
  //         const valorAbono = abono.valor || '0';
  //         const codigoFactura = abono.deudaCliente?.factura?.codigo || 'Sin código';

  //         const cliente = abono.deudaCliente?.empresaClienteContador?.cliente;

  //         const clienteNombreCompleto = cliente
  //           ? `${cliente.nombre ?? ''} ${cliente.segundoNombre ?? ''} ${cliente.apellido ?? ''} ${cliente.segundoApellido ?? ''}`.trim().replace(/\s+/g, ' ')
  //           : 'Sin cliente';

  //         return {
  //           ...abono,
  //           codigoFactura,
  //           clienteFactura: clienteNombreCompleto,
  //           valorTexto: `$${parseFloat(valorAbono).toLocaleString('es-CO')}`,
  //           fechaAbonoTexto: abono.fechaCreacion?.toString().slice(0, 10)
  //         };
  //       });

  //       this.tableData = abonosTransformados;
  //     },
  //     error => {
  //       console.error('Error al cargar los abonos:', error);
  //     }
  //   );
  // }

}
