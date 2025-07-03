import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <button (click)="clicked.emit()" [class]="class()">
    <ng-content></ng-content>
  </button>
  `,
})
export class Buttoon {
  clicked = output<void>();
  class = input<string>()
}
