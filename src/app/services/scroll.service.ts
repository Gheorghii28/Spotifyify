import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollSignal: WritableSignal<Event | null> = signal(null);

  get scroll() {
    return this.scrollSignal;
  }

  emitScrollEvent(event: Event) {
    this.scrollSignal.set(event);
  }
}
