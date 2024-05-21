import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { getWindow, getDocument } from 'ssr-window';

@Injectable({
  providedIn: 'root',
})
export class HeightService {
  private isFullScreen: boolean = false;
  private isFullSreen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.isFullScreen
  );
  constructor(@Inject(DOCUMENT) private document: any) {}

  adjustHeightOnWindowResize(): void {
    const window = getWindow();
    fromEvent(window, 'load').subscribe(() => {
      this.adjustElementHeights();
    });
    fromEvent(window, 'resize').subscribe(() => {
      this.adjustElementHeights();
    });
  }

  adjustElementHeights(): void {
    const window = getWindow();
    const document = getDocument();
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

  public chkScreenMode(): void {
    if (this.document.fullscreenElement) {
      this.isFullSreen$.next(true);
    } else {
      this.isFullSreen$.next(false);
      setTimeout(() => {
        this.adjustElementHeights();
      });
    }
  }

  public openFullscreen(elem: any): void {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  public closeFullscreen(): void {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      this.document.msExitFullscreen();
    }
  }

  public isFullscreen$(): Observable<boolean> {
    return this.isFullSreen$.asObservable();
  }
}
