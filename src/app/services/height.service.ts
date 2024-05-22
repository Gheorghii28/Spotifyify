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
    const totalHeight = window.innerHeight - 16;
    const footerElement = document.querySelector('.current-track');
    const footerHeight = footerElement
      ? footerElement.getBoundingClientRect().height
      : 0;
    const contentHeight = totalHeight - footerHeight;

    document
      .querySelector('.main-content')
      ?.setAttribute('style', `height: ${contentHeight}px`);
    document
      .querySelector('.mat-drawer-container')
      ?.setAttribute('style', `height: ${contentHeight}px`);
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
