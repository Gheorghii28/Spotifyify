import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeightService {
  constructor() {}

  adjustHeightOnWindowResize(): void {
    fromEvent(window, 'load').subscribe(() => {
      this.adjustElementHeights();
    });
    fromEvent(window, 'resize').subscribe(() => {
      this.adjustElementHeights();
    });
  }

  adjustElementHeights(): void {
    const totalHeight = window.innerHeight - 30;

    const headerElement = document.querySelector('.header');
    const footerElement = document.querySelector('.current-track');
    const playlistElement = document.querySelector('.playlist');
    const nowPlayingElement = document.querySelector('.playing');

    const headerHeight = headerElement
      ? headerElement.getBoundingClientRect().height
      : 0;
    const footerHeight = footerElement
      ? footerElement.getBoundingClientRect().height
      : 0;
    const playlistHeight = playlistElement
      ? playlistElement.getBoundingClientRect().height
      : 0;
    const nowPlayingHeight = nowPlayingElement
      ? nowPlayingElement.getBoundingClientRect().height
      : 0;

    const navHeight =
      totalHeight -
      (headerHeight + footerHeight + playlistHeight + nowPlayingHeight);
    const content = totalHeight + 30 - (headerHeight + footerHeight);

    document
      .querySelector('.navigation')
      ?.setAttribute('style', `height: ${navHeight}px`);
    document
      .querySelector('.content-middle')
      ?.setAttribute('style', `height: ${content}px`);
  }
}
