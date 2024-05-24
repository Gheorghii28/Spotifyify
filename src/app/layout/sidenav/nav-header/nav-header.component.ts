import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer } from '@angular/material/sidenav';
import { DrawerService } from '../../../services/drawer.service';
import { Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule],
  templateUrl: './nav-header.component.html',
  styleUrl: './nav-header.component.scss',
})
export class NavHeaderComponent implements OnDestroy {
  @Input() drawerSidenav!: MatDrawer;
  @Input() sidenavExpanded!: boolean;
  sidenavWidth!: number;
  private sidenavWidthSubscription!: Subscription;

  constructor(private drawerService: DrawerService) {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.sidenavWidthSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.sidenavWidthSubscription = this.drawerService
      .observeSidenavWidth()
      .subscribe((width: number) => {
        this.sidenavWidth = width;
      });
  }

  toggleDrawer(): void {
    this.drawerService.setSidenavExpanded(!this.sidenavExpanded);
  }

  toggleSidenavWidth(): void {
    const newWidth = this.sidenavWidth === 631 ? 289 : 631;
    this.drawerService.setSidenavWidth(newWidth);
  }
}
