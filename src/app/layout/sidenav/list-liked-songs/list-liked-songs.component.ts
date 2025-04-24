import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationService } from '../../../services/navigation.service';
import { CloudService } from '../../../services/cloud.service';

@Component({
  selector: 'app-list-liked-songs',
  imports: [CommonModule],
  templateUrl: './list-liked-songs.component.html',
  styleUrl: './list-liked-songs.component.scss',
})
export class ListLikedSongsComponent {
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @Input() myTracksTotal!: number;
  @Input() sidenavExpanded!: boolean;
  @Input() sidenavWidth!: number;
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };

  constructor(
    public navigationService: NavigationService,
    public cloudService: CloudService,
  ) { }

  public navigateToPlaylist(): void {
    this.navigationService.likedSongs();
  }
}
