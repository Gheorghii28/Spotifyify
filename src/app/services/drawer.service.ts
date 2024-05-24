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
  constructor() {}

  public observeSidenavExpanded(): Observable<boolean> {
    return this.sidenavExpanded$.asObservable();
  }
  public observeSidenavWidth(): Observable<number> {
    return this.sidenavWidth$.asObservable();
  }

  public setSidenavExpanded(value: boolean): void {
    this.sidenavExpanded$.next(value);
  }

  public setSidenavWidth(value: number): void {
    this.sidenavWidth$.next(value);
  }

  public toggleDrawer(drawerInstance: MatDrawer): void {
    if (drawerInstance) {
      drawerInstance.toggle();
    }
  }
}
