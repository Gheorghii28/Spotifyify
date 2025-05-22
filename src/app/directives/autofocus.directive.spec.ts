import { AutofocusDirective } from './autofocus.directive';

describe('AutofocusDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: document.createElement('input') } as any;
    const directive = new AutofocusDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
