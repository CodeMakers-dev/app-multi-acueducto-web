import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

  <!-- Card -->
<div class="w-[280px] rounded-xl bg-slate-800 text-slate-100 p-4 shadow-sm">
  <!-- Header -->
  <div class="flex items-start justify-between">
    <div class="space-y-1">
      <p class="text-sm/5 text-slate-400">Clientes Activos</p>
      <div class="text-3xl font-extrabold tracking-tight">765</div>
    </div>

    <!-- Icon badge -->
    <div class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-700/60">
      <!-- gear icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.16 7.16 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 14.4 1h-3.8a.5.5 0 0 0-.49.41l-.36 2.54c-.58.24-1.13.55-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.62 7.97a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.74 13.6a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.5.39 1.05.7 1.63.94l.36 2.54c.05.24.25.41.49.41h3.8c.24 0 .45-.17.49-.41l.36-2.54c.58-.24 1.13-.55 1.63-.94l2.39.96c.21.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
      </svg>
    </div>
  </div>

  <!-- Delta -->
  <div class="mt-3 flex items-center gap-2">
    <span class="inline-flex h-1.5 w-1.5 rounded-full bg-rose-500"></span>
    <span class="text-sm font-medium text-rose-400">-21%</span>
    <span class="text-sm text-slate-400">vs last month</span>
  </div>

  <!-- Progress -->
  <div class="mt-3">
    <div class="h-2 w-full rounded-full bg-slate-700">
      <div class="h-2 w-[62%] rounded-full bg-gradient-to-r from-rose-500 to-orange-400"></div>
    </div>
  </div>
</div>


  `,
})
export class KpiCardComponent {

}
