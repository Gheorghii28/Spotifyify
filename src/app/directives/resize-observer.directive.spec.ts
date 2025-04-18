import { ElementRef } from '@angular/core';
import { ResizeObserverDirective } from './resize-observer.directive';

describe('ResizeObserverDirective', () => {
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('div'));
  });

  it('should create an instance', () => {
    const directive = new ResizeObserverDirective(
      elementRef
    );
    expect(directive).toBeTruthy();
  });
});
