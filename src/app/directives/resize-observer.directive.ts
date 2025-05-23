import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';

@Directive({
  selector: '[resizeObserver]',
})
export class ResizeObserverDirective implements AfterViewInit {
  @Output()
  resize = new EventEmitter<ResizeObserverEntry>();

  private entriesMap = new WeakMap();
  private ro: ResizeObserver | undefined;

  constructor( private el: ElementRef ) {
    this.ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (this.entriesMap.has(entry.target)) {
          const comp = this.entriesMap.get(entry.target);
          comp._resizeCallback(entry);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.ro) {
      const target = this.el.nativeElement;
      this.entriesMap.set(target, this);
      this.ro.observe(target);
    }
  }

  ngOnDestroy(): void {
    if (this.ro) {
      const target = this.el.nativeElement;
      this.ro.unobserve(target);
      this.entriesMap.delete(target);
    }
  }

  _resizeCallback(entry: ResizeObserverEntry): void {
    this.resize.emit(entry);
  }
}
