import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[scrollable]',
  standalone: true,
})
export class CustomScrollbarDirective {
  hostElement!: HTMLElement;
  constructor(private element: ElementRef) {
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
  }
}
