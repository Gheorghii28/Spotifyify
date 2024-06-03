import { ElementRef } from '@angular/core';
import { CustomScrollbarDirective } from './custom-scrollbar.directive';

describe('CustomScrollbarDirective', () => {
  it('should create an instance', () => {
    const elementRefMock = new ElementRef(document.createElement('div'));
    const directive = new CustomScrollbarDirective(elementRefMock);
    expect(directive).toBeTruthy();
  });
});
