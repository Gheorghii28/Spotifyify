import { Injectable } from '@angular/core';
import { getDocument } from 'ssr-window';

@Injectable({
  providedIn: 'root',
})
export class DomManipulationService {
  constructor() {}

  public getElementById(id: string): HTMLElement | null {
    const document = getDocument();
    return document.getElementById(id);
  }

  public applyStylesToElement(
    element: HTMLElement,
    styles: { [key: string]: string }
  ): void {
    Object.keys(styles).forEach((style: any) => {
      element.style[style] = styles[style];
    });
  }
}
