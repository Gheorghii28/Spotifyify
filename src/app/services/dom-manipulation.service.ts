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

  public getElementsByClass(className: string): HTMLCollectionOf<Element> {
    const document = getDocument();
    return document.getElementsByClassName(className);
  }

  public applyStylesToElement(
    element: HTMLElement,
    styles: { [key: string]: string }
  ): void {
    Object.keys(styles).forEach((style: any) => {
      element.style[style] = styles[style];
    });
  }
  
  public applyStylesToElementByClass(
    className: string,
    property: string,
    value: string
  ): void {
    const elements = this.getElementsByClass(className);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      (element.style as any)[property] = value;
    }
  }
}
