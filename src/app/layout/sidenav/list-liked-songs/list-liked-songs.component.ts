import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationService } from '../../../services';

@Component({
  selector: 'app-list-liked-songs',
  imports: [CommonModule],
  templateUrl: './list-liked-songs.component.html',
  styleUrl: './list-liked-songs.component.scss',
})
export class ListLikedSongsComponent {
  private navigationService = inject(NavigationService);

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @Input() myTracksTotal!: number;
  @Input() sidenavExpanded!: boolean;
  @Input() sidenavWidth!: number;
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };

  public navigateToPlaylist(): void {
    this.navigationService.likedSongs();
  }
}
