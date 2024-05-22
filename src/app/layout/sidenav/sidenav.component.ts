import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatListModule, MatButtonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
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

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
