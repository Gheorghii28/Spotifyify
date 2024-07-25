import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollSubject = new Subject<Event>();
  scroll$ = this.scrollSubject.asObservable();

  emitScrollEvent(event: Event) {
    this.scrollSubject.next(event);
  }
}
