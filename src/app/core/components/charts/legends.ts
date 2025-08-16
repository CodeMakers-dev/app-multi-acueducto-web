import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';


// Declaración global (igual a tu donut)
declare var ApexCharts: any;

// Tipos mínimos para el área con ejes
interface AreaSeries {
  name: string;
  data: number[];
  color?: string;
}

interface AreaChartOptions {
  series: AreaSeries[];
  chart: {
    height: number | string;
    maxWidth?: string;
    type: 'area';
    fontFamily?: string;
    dropShadow?: { enabled: boolean };
    toolbar: { show: boolean };
  };
  tooltip: {
    enabled: boolean;
    x: { show: boolean };
    y?: { formatter?: (value: number) => string };
  };
  legend: { show: boolean };
  fill: {
    type: 'gradient' | 'solid';
    gradient?: {
      opacityFrom: number;
      opacityTo: number;
      shade?: string;
      gradientToColors?: string[];
    };
  };
  dataLabels: { enabled: boolean };
  stroke: { width: number };
  grid: {
    show: boolean;
    strokeDashArray: number;
    padding: { left: number; right: number; top: number };
  };
  xaxis: {
    categories: string[];
    labels: { show: boolean };
    axisBorder: { show: boolean };
    axisTicks: { show: boolean };
  };
  yaxis: {
    show: boolean;
    labels: { formatter: (v: number) => string };
  };
}

@Component({
  selector: 'app-legends',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `


<div class="w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
  <div class="flex justify-between mb-5">
    <div>
      <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">Ingresos vs Gastos</h5>
      <p class="text-base font-normal text-gray-500 dark:text-gray-400">Ventas este mes</p>
    </div>
    <div
      class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
      23%
      <svg class="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
      </svg>
    </div>
  </div>
  <div id="legend-chart"></div>
  <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
    <div class="flex justify-between items-center pt-5">
      <!-- Button -->
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="lastDaysdropdown"
        data-dropdown-placement="bottom"
        class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
        type="button">
        Últimos 30 días
        <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      <!-- Dropdown menu -->
      <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Ayer</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Hoy</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Últimos 7 días</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Últimos 30 días</a>
            </li>
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Últimos 90 días</a>
            </li>
          </ul>
      </div>
      <a
        href="#"
        class="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
        Ver más
        <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
        </svg>
      </a>
    </div>
  </div>
</div>


  `,
})
export class Legends {
 private chart: any;

  private readonly platformId = inject(PLATFORM_ID);


  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAreaChart();
    }
  }


  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private getOptions(): AreaChartOptions {
    return {
      // series: array de objetos (bar/line/area)
      series: [
        {
          name: 'Ingresos',
          data: [1500, 1418, 1456, 1526, 1356, 1256],
          color: '#1A56DB',
        },
        {
          name: 'Gastos',
          data: [643, 413, 765, 412, 1423, 1731],
          color: '#7E3BF2',
        },
      ],
      chart: {
        height: 200,        // respeta tu ejemplo
        maxWidth: '800px',
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        dropShadow: { enabled: false },
        toolbar: { show: false },
      },
      tooltip: {
        enabled: true,
        x: { show: false },
        // si quieres formato de moneda en tooltip:
        y: { formatter: (v: number) => `$${v}` },
      },
      legend: { show: true },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: '#1C64F2',
          gradientToColors: ['#1C64F2'],
        },
      },
      dataLabels: { enabled: false },
      stroke: { width: 6 },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: { left: 2, right: 2, top: -26 },
      },
      xaxis: {
        categories: [
          'Enero','Febrero','Marzo',
          'Abril','Mayo','Junio','Julio'
        ],
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        show: false,
        labels: {
          formatter: (value: number) => `$${value}`,
        },
      },
    };
  }

  private initializeAreaChart(): void {
    const el = document.getElementById('legend-chart') as HTMLElement;
    if (el && typeof ApexCharts !== 'undefined') {
      this.chart = new ApexCharts(el, this.getOptions());
      this.chart.render();
    } else {
      console.error('ApexCharts no está cargado o falta el elemento #legend-chart');
    }
  }
}
