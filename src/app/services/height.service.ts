import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeightService {
  constructor() {}

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
    const artistHeight = totalHeight - (headerHeight + footerHeight);

    document
      .querySelector('.navigation')
      ?.setAttribute('style', `height: ${navHeight}px`);
    document
      .querySelector('.artist')
      ?.setAttribute('style', `height: ${artistHeight}px`);
    document
      .querySelector('.social')
      ?.setAttribute('style', `height: ${artistHeight}px`);
  }
}
