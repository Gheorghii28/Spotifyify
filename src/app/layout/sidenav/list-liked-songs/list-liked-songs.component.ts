import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../../services/drawer.service';

@Component({
  selector: 'app-list-liked-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-liked-songs.component.html',
  styleUrl: './list-liked-songs.component.scss',
})
export class ListLikedSongsComponent {
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @Input() myTracksTotal!: number;
  @Input() sidenavExpanded!: boolean;
  public sidenavWidth!: number;
  private sidenavWidthSubscription!: Subscription;
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };

  constructor(
    private drawerService: DrawerService,
    private router: Router
  ) {
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

  public navigateToPlaylist(): void {
    this.router.navigate(['/my-tracks']);
  }
}
