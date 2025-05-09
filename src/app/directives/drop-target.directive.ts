import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { Playlist } from '../models';

@Directive({
  selector: '[appDropTarget]',
})
export class DropTargetDirective {
  @Output() onDrop = new EventEmitter<any>();
  @Input() dropContainerClass!: string;
  @Input() dropItemClass!: string;
  private dragCounter = 0;
  private originalStyles: { [key: string]: string | null } = {
    border: '2px solid transparent',
  };
  private dragStyles: { [key: string]: string | null } = {
    border: '2px solid #1db954',
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.resetStyles(this.el.nativeElement);
  }

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  @HostListener('drop', ['$event']) onDropHandler(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter = 0;
    const playlist: Playlist = JSON.parse(
      event.dataTransfer?.getData('text/plain') || '{}'
    );
    this.resetStyles(this.el.nativeElement);
    this.onDrop.emit(playlist);
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter++;
    if (this.dragCounter === 1) {
      const containerElement = (event.target as HTMLElement).closest(
        `.${this.dropContainerClass}`
      );
      this.applyStyles(this.el.nativeElement);
      if (
        this.isElementWithClass(event.target, this.dropItemClass) &&
        containerElement
      ) {
        this.resetStyles(containerElement as HTMLElement);
      }
    }
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      const containerElement = (event.target as HTMLElement).closest(
        `.${this.dropContainerClass}`
      );
      this.resetStyles(this.el.nativeElement);
      if (
        this.isElementWithClass(event.target, this.dropItemClass) &&
        containerElement
      ) {
        this.applyStyles(containerElement as HTMLElement);
      }
    }
  }

  private applyStyles(element: HTMLElement): void {
    for (let property in this.dragStyles) {
      this.renderer.setStyle(element, property, this.dragStyles[property]);
    }
  }

  private resetStyles(element: HTMLElement): void {
    for (let property in this.originalStyles) {
      this.renderer.setStyle(element, property, this.originalStyles[property]);
    }
  }

  private isElementWithClass(
    target: EventTarget | null,
    elClass: string
  ): boolean {
    if (target instanceof HTMLElement) {
      const closestEl = target.closest(`.${elClass}`);
      return closestEl !== null;
    }
    return false;
  }
}
