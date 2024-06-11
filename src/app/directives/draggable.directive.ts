import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDraggable]',
  standalone: true,
})
export class DraggableDirective {
  @HostBinding('draggable') draggable = true;
  @Input() appDraggable!: string;

  constructor() {}

  @HostListener('dragstart', ['$event']) onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.appDraggable);
  }
}
