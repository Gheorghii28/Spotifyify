import { ElementRef } from '@angular/core';
import { ResizeObserverDirective } from './resize-observer.directive';
import { PlatformDetectionService } from '../services/platform-detection.service';

describe('ResizeObserverDirective', () => {
  let elementRef: ElementRef;
  let platformDetectionService: PlatformDetectionService;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('div'));
    platformDetectionService = {
      isBrowser: true,
      isServer: false,
    } as PlatformDetectionService;
  });

  it('should create an instance', () => {
    const directive = new ResizeObserverDirective(
      elementRef,
      platformDetectionService
    );
    expect(directive).toBeTruthy();
  });
});
