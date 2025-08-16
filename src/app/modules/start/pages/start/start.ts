import { DonutChartComponent } from './../../../../core/components/charts/donut-chart';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BarChartComponent } from "@components/charts/bar-chart";
import { Legends } from "@components/charts/legends";
import { WebsiteTraffic } from "@components/charts/website-traffic";
import { KpiCardComponent } from "@components/charts/kpi-card";

@Component({
  selector: 'app-start',
  imports: [RouterModule, DonutChartComponent, BarChartComponent, Legends, WebsiteTraffic, KpiCardComponent],
  template: `
<!-- Dashboard Layout -->
<section class="mx-auto w-full max-w-7xl p-4 md:p-6">
  <!-- Row 1: KPI cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <div class="rounded-2xl ">
      <app-kpi-card></app-kpi-card>
    </div>
    <div class="rounded-2xl ">
      <!-- KPI: Consumo Total m³ -->
 <app-kpi-card></app-kpi-card>
    </div>
    <div class="rounded-2xl ">
      <!-- KPI: % Recaudo -->
 <app-kpi-card></app-kpi-card>
    </div>
    <div class="rounded-2xl ">
      <!-- KPI: Deuda Total -->
 <app-kpi-card></app-kpi-card>
    </div>
  </div>

  <!-- Row 2: charts principal + 2 laterales -->
  <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
    <!-- Línea grande: Consumo diario -->
    <div class="lg:col-span-2 rounded-2xl ">
      <h3 class="mb-3 text-sm font-semibold text-neutral-200">Consumo diario total (m³)</h3>
      <app-legends></app-legends>

    </div>

    <!-- Pie/Donut: % pagos por vereda -->
    <div class="rounded-2xl ">
      <h3 class="mb-3 text-sm font-semibold text-neutral-200">% de pagos por vereda</h3>
<app-website-traffic></app-website-traffic>
    </div>

    <!-- Pie/Donut 2: Distribución clientes por vereda -->
    <div class="rounded-2xl lg:col-start-3">
      <h3 class="mb-3 text-sm font-semibold text-neutral-200">Distribución de clientes</h3>

    </div>
  </div>

  <!-- Row 3: 3 gráficas/ tarjetas inferiores -->
  <div class="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div class="rounded-2xl  p-4 shadow">
      <h3 class="mb-3 text-sm font-semibold text-neutral-200">Clientes por vereda</h3>

    </div>

    <div class="rounded-2xl ">
   <app-donut-chart></app-donut-chart>

    </div>
  <app-bar-chart></app-bar-chart>
    <div class="rounded-2xl bg-neutral-900 p-4 shadow">
      <h3 class="mb-3 text-sm font-semibold text-neutral-200">Facturación vs Recaudo (últimos 6 meses)</h3>

    </div>
  </div>

  <!-- Row 4 opcional: tabla / actividades -->
  <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-2 rounded-2xl bg-neutral-900 p-4 shadow">
      <h3 class="mb-3 text-sm font-semibold text-neutral-200">Top 10 morosos</h3>

    </div>
    <div class="rounded-2xl bg-neutral-900 p-4 shadow">
      <h3 class="mb-3 text-sm font-semibold text-neutral-200">Incidencias y mantenimientos</h3>

    </div>
  </div>
</section>

  `
})
export class Start  {

}
