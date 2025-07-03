import { CommonModule } from '@angular/common'
import { Component, ChangeDetectionStrategy, HostListener, inject, computed, input, DOCUMENT } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if(isExternalUrl() || isAnchor()) {
    <a [href]="link()" [target]="target()" rel="noopener noreferrer">
      <ng-template *ngTemplateOutlet="content"></ng-template>
    </a>
    } @else {
    <a [routerLink]="link()" [class.anchor-link]="isAnchor()">
      <ng-template *ngTemplateOutlet="content"></ng-template>
    </a>
    }

    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Link {
link = input.required<string>()
  scrollBehavior = input<ScrollBehavior>('smooth')

  protected target = computed(() => (this.isExternalUrl() ? '_blank' : '_self'))
  protected isAnchor = computed(() => this.link()?.startsWith('#'))
  protected isExternalUrl = computed(() => this.link()?.startsWith('http'))

  private router = inject(Router)
  private document = inject(DOCUMENT)


  @HostListener('click', ['$event'])
  handleClick(event: Event): void {
    if (!this.link()) return
    if (this.isExternalUrl()) return
    event.preventDefault()

    if (this.isAnchor()) {
      const targetId = this.link()!.substring(1)
      const targetElement = this.document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: this.scrollBehavior(),
          block: 'start',
        })
      }
    } else {
      this.router.navigateByUrl(this.link()!)
    }
  }
}
