import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { DomManipulationService } from '../services';

@Directive({
  selector: '[scrollable]',
})
export class CustomScrollbarDirective {
  private domService = inject(DomManipulationService);
  private element = inject(ElementRef);

  hostElement!: HTMLElement;
  
  constructor() {
    this.hostElement = this.element.nativeElement;
  }

  @HostListener('mouseenter')
  applyCustomScroll(): void {
    this.hostElement?.classList.add('custom-scroll-vertical-hover');
    this.updateCustomScrollbar();
  }

  @HostListener('mouseleave')
  removeCustomScroll(): void {
    this.hostElement?.classList.remove('custom-scroll-vertical-hover');
  }

  @HostListener('mousemove')
  onMouseMove(): void {
    this.updateCustomScrollbar();
  }

  @HostListener('scroll')
  onScroll(): void {
    this.updateCustomScrollbar();
  }

  private updateCustomScrollbar(): void {
    const scrollArea = this.element.nativeElement;
    const scrollPosition = scrollArea.scrollTop;
    const scrollHeight = scrollArea.scrollHeight;
    const clientHeight = scrollArea.clientHeight;
    const scrollbarTop = (scrollPosition / scrollHeight) * clientHeight;
    const scrollbarHeight = (clientHeight / scrollHeight) * clientHeight;

    scrollArea.style.setProperty('--custom-scrollbar-top', scrollbarTop + 'px');
    scrollArea.style.setProperty(
      '--custom-scrollbar-height',
      scrollHeight === scrollbarHeight ? '0px' : `${scrollbarHeight}px`
    );
    this.checkScrollPosition(scrollPosition);
  }

  private checkScrollPosition(scrollPosition: number): void {
    const targetElement = this.domService.getElementById('top-container');
    if (targetElement) {
      if (scrollPosition > 240) {
        this.domService.applyStylesToElement(targetElement, {
          opacity: '1',
        });
      } else {
        this.domService.applyStylesToElement(targetElement, {
          opacity: '0',
        });
      }
    }
  }
}
