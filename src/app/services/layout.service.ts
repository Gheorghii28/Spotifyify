import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';
import { getWindow, getDocument } from 'ssr-window';
import { DrawerService } from './drawer.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService implements OnDestroy {
  private isFullScreen: boolean = false;
  private isFullSreen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.isFullScreen
  );
  private sidenavWidth!: number;
  private sidenavWidthSubscription!: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private drawerService: DrawerService
  ) {
    this.sidenavWidthSubscription = this.drawerService
      .observeSidenavWidth()
      .subscribe((width: number) => {
        this.sidenavWidth = width;
      });
  }

  ngOnDestroy(): void {
    this.sidenavWidthSubscription.unsubscribe();
  }

  public observeFullscreenState(): Observable<boolean> {
    return this.isFullSreen$.asObservable();
  }

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
      this.isFullSreen$.next(true);
    } else {
      this.isFullSreen$.next(false);
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

  public handleDrawerOnResize(drawerEndStatus: boolean): void {
    const window = getWindow();
    const checkWindowSize = () => {
      const isSmallScreen = this.isWindowWidthLessThan(1008);
      const shouldCollapseDrawer = isSmallScreen && drawerEndStatus;
      this.drawerService.setSidenavExpanded(!shouldCollapseDrawer);
      if (this.isWindowWidthLessThan(1300)) {
        this.drawerService.updateDrawerEndStatusBasedOnSidenavWidth(
          this.sidenavWidth
        );
      }
      this.drawerService.updateDrawerConfiguration(
        drawerEndStatus,
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
