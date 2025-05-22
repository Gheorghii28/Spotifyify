import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autofocusDirective]'
})
export class AutofocusDirective {

  constructor(private host: ElementRef) { }

  ngAfterViewInit(): void {
    this.host.nativeElement.focus();
  }

}
