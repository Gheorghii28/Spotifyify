import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    NavHeaderComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnDestroy {
  @Input() drawerSidenav!: MatDrawer;
  sidenavExpanded!: boolean;
  private sidenavExpandedSubscription!: Subscription;
  navigationData = [
    {
      title: 'Main',
      items: [
        { label: 'Browse', route: 'browse' },
        { label: 'Activity', route: 'activity' },
        { label: 'Radio', route: 'radio' },
      ],
    },
    {
      title: 'Your Music',
      items: [
        { label: 'Songs', route: 'songs' },
        { label: 'Albums', route: 'albums' },
        { label: 'Artists', route: 'artists' },
        { label: 'Local Files', route: 'local-files' },
      ],
    },
    {
      title: 'Playlists',
      items: [
        { label: 'Doo Wop', route: 'doo-wop' },
        { label: 'Pop Classics', route: 'pop-classics' },
        { label: 'Love Songs', route: 'love-songs' },
        { label: 'Hipster', route: 'hipster' },
        { label: 'New Music Friday', route: 'new-music-friday' },
        { label: 'Techno Poppers', route: 'techno-poppers' },
        { label: 'Summer Soothers', route: 'summer-soothers' },
        { label: 'Hard Rap', route: 'hard-rap' },
        { label: '5 Stars', route: '5-stars' },
        { label: 'Dope Dancin', route: 'dope-dancin' },
        { label: 'Sleep', route: 'sleep' },
      ],
    },
  ];

  constructor(private router: Router, private drawerService: DrawerService) {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.sidenavExpandedSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.sidenavExpandedSubscription = this.drawerService
      .observeSidenavExpanded()
      .subscribe((expanded: boolean) => {
        this.sidenavExpanded = expanded;
      });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
