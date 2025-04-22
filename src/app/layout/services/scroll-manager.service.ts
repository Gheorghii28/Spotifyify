import { ElementRef, Injectable, NgZone } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Injectable({
  providedIn: 'root'
})
export class ScrollManagerService {
  private scrollContainer?: HTMLElement;
  private listener!: (event: Event) => void;

  constructor(private ngZone: NgZone, private scrollService: ScrollService) { }

  registerScrollContainer(containerRef: ElementRef): void {
    this.scrollContainer = containerRef.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      this.listener = (event: Event) => this.scrollService.emitScrollEvent(event);
      this.scrollContainer?.addEventListener('scroll', this.listener);
    });
  }

  unregister(): void {
    this.scrollContainer?.removeEventListener('scroll', this.listener);
  }

  ngOnDestroy(): void {
    this.unregister();
  }
}
