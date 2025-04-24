import { Injectable, signal, WritableSignal } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  sidenavExpanded: WritableSignal<boolean> = signal(true);
  sidenavWidth: WritableSignal<number> = signal(289);
  isDrawerInfoOpened: WritableSignal<boolean> = signal(true);

  constructor() {}

  public toggleDrawer(drawerInstance: MatDrawer): void {
    if (drawerInstance) {
      drawerInstance.toggle();
    }
  }

  public updateDrawerEndStatusBasedOnSidenavWidth(newWidth: number): void {
    if (newWidth === 631) {
      this.isDrawerInfoOpened.set(false);
    } else {
      this.isDrawerInfoOpened.set(true);
    }
  }

  public updateDrawerConfiguration(
    drawerEndStatus: boolean,
    isConditionForWidthUpdate: boolean,
    isConditionForExpansionUpdate: boolean
  ): void {
    if (drawerEndStatus) {
      if (isConditionForWidthUpdate) {
        this.sidenavWidth.set(289);
        this.updateDrawerEndStatusBasedOnSidenavWidth(289);
      }
      if (isConditionForExpansionUpdate) {
        this.sidenavExpanded.set(false);
      }
    }
  }
}
