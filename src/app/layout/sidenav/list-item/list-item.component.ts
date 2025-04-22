import { Component, Input, ViewChild } from '@angular/core';
import { Playlist } from '../../../models/spotify.model';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemovePlaylistComponent } from '../../../components/dialog/dialog-remove-playlist/dialog-remove-playlist.component';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { UtilsService } from '../../../services/utils.service';
import { DialogChangePlaylistDetailsComponent } from '../../../components/dialog/dialog-change-playlist-details/dialog-change-playlist-details.component';
import { SpotifyService } from '../../../services/spotify.service';
import { CloudService } from '../../../services/cloud.service';
import { DialogChangePlaylistDetailsData } from '../../../models/dialog.model';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-list-item',
  imports: [CommonModule, MatMenuModule, CustomButtonComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
})
export class ListItemComponent {
  @Input() playlist!: Playlist;
  @Input() sidenavExpanded!: boolean;
  @Input() sidenavWidth!: number;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  public contextMenuPosition = { x: '0px', y: '0px' };
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };
  
  constructor(
    private dialog: MatDialog,
    public utilsService: UtilsService,
    private spotifyService: SpotifyService,
    private cloudService : CloudService,
    public navigationService: NavigationService
  ) { }

  public onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu.menu) {
      this.contextMenu.menu.focusFirstItem('mouse');
    }
    this.contextMenu.openMenu();
  }

  public navigateToPlaylist(): void {
    this.navigationService.playlist(this.playlist.id);
  }

  public openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogRemovePlaylistComponent, {
      data: { name: this.playlist.name, id: this.playlist.id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public openChangeDialog(): void {
    const dialogRef = this.dialog.open(DialogChangePlaylistDetailsComponent, {
      data: { 
        id: this.playlist.id, 
        name: this.playlist.name, 
        description: this.playlist.description 
      },
    });

    dialogRef.afterClosed().subscribe((result: DialogChangePlaylistDetailsData) => {
      if (result) {
        this.spotifyService.changePlaylistDetails(result).subscribe({
          next: (response) => {
            this.cloudService.updatePlaylistDetails(result);
         },
          error: (err) => {
            console.error('Failed to update playlist:', err);
          }
        });
      } else {
        console.log('Dialog was closed without changes');
      }
    });
  }
}
