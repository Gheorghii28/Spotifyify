import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private sidenavExpanded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  private sidenavWidth$: BehaviorSubject<number> = new BehaviorSubject<number>(
    289
  );
  private isDrawerInfoOpened$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  constructor() {}

  public observeSidenavExpanded(): Observable<boolean> {
    return this.sidenavExpanded$.asObservable();
  }

  public observeSidenavWidth(): Observable<number> {
    return this.sidenavWidth$.asObservable();
  }

  public observedrawerEndStatus(): Observable<boolean> {
    return this.isDrawerInfoOpened$.asObservable();
  }

  public setSidenavExpanded(value: boolean): void {
    this.sidenavExpanded$.next(value);
  }

  public setSidenavWidth(value: number): void {
    this.sidenavWidth$.next(value);
  }

  public setdrawerEndStatus(isOpened: boolean): void {
    this.isDrawerInfoOpened$.next(isOpened);
  }

  public toggleDrawer(drawerInstance: MatDrawer): void {
    if (drawerInstance) {
      drawerInstance.toggle();
    }
  }

  public updateDrawerEndStatusBasedOnSidenavWidth(newWidth: number): void {
    if (newWidth === 631) {
      this.setdrawerEndStatus(false);
    } else {
      this.setdrawerEndStatus(true);
    }
  }

  public updateDrawerConfiguration(
    drawerEndStatus: boolean,
    isConditionForWidthUpdate: boolean,
    isConditionForExpansionUpdate: boolean
  ): void {
    if (drawerEndStatus) {
      if (isConditionForWidthUpdate) {
        this.setSidenavWidth(289);
        this.updateDrawerEndStatusBasedOnSidenavWidth(289);
      }
      if (isConditionForExpansionUpdate) {
        this.setSidenavExpanded(false);
      }
    }
  }
}
