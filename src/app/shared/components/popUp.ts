import {
  Component,
  ChangeDetectionStrategy,
  input,
  WritableSignal,
  output,
  computed,
  effect,
} from '@angular/core';

@Component({
  selector: 'app-pop-up',
  standalone: true,
  template: `
    @if (isOpen()) {
    <div
      id="overlay"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      (click)="close()"
    >
      <div
        class="relative w-full max-w-md p-4"
        (click)="$event.stopPropagation()"
      >
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <button
            (click)="close()"
            aria-label="Close"
            class="absolute top-3 end-2.5 h-8 w-8 grid place-content-center
                          text-gray-400 hover:bg-gray-200 rounded-lg"
          >
            <svg class="h-3 w-3" viewBox="0 0 14 14" fill="none">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
          <div class="p-5 text-center">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent {
  readonly open = input.required<WritableSignal<boolean>>();
  readonly openChange = output<WritableSignal<boolean>>();
  readonly isOpen = computed(() => this.open()());

  constructor() {
    effect(() => this.openChange.emit(this.open()));
  }

  close = () => this.open().set(false);
}
