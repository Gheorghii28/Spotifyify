import { DOCUMENT } from '@angular/common';
import { inject, Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { getWindow, getDocument } from 'ssr-window';
import { DrawerService } from './drawer.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private drawerService = inject(DrawerService);

  isFullScreen: WritableSignal<boolean> = signal(false);
  
  constructor(
    @Inject(DOCUMENT) private document: any,
  ) { }

  public adjustHeightOnWindowResize(): void {
    const window = getWindow();
    fromEvent(window, 'load').subscribe(() => {
      this.adjustElementHeights();
    });
    fromEvent(window, 'resize').subscribe(() => {
      this.adjustElementHeights();
    });
  }

  public adjustElementHeights(): void {
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

  public updateFullscreenState(): void {
    if (this.document.fullscreenElement) {
      this.isFullScreen.set(true);
    } else {
      this.isFullScreen.set(false);
      setTimeout(() => {
        this.adjustElementHeights();
      });
    }
  }

  public requestFullscreen(elem: any): void {
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

  public exitFullscreen(): void {
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

  public handleDrawerOnResize(): void {
    const window = getWindow();
    const checkWindowSize = () => {
      const isSmallScreen = this.isWindowWidthLessThan(1008);
      const shouldCollapseDrawer = isSmallScreen && this.drawerService.isDrawerInfoOpened();
      this.drawerService.sidenavExpanded.set(!shouldCollapseDrawer);
      if (this.isWindowWidthLessThan(1300)) {
        this.drawerService.updateDrawerEndStatusBasedOnSidenavWidth(
          this.drawerService.sidenavWidth()
        );
      }
      this.drawerService.updateDrawerConfiguration(
        this.drawerService.isDrawerInfoOpened(),
        this.isWindowWidthLessThan(1300),
        this.isWindowWidthLessThan(1020)
      );
    };
    fromEvent(window, 'load').subscribe(checkWindowSize);
    fromEvent(window, 'resize').subscribe(checkWindowSize);
  }

  public isWindowWidthLessThan(width: number): boolean {
    const window = getWindow();
    return window.innerWidth < width;
  }
}
