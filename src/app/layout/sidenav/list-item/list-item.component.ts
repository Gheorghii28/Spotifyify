import { Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemovePlaylistComponent } from '../../../components/dialog/dialog-remove-playlist/dialog-remove-playlist.component';
import { CustomButtonComponent } from '../../../components/buttons/custom-button/custom-button.component';
import { DialogChangePlaylistDetailsComponent } from '../../../components/dialog/dialog-change-playlist-details/dialog-change-playlist-details.component';
import { DialogChangePlaylistDetailsData } from '../../../models/dialog.model';
import { Playlist } from '../../../models';
import { PlaylistManagerService } from '../../services/playlist-manager.service';
import { NavigationService, UtilsService } from '../../../services';

@Component({
  selector: 'app-list-item',
  imports: [CommonModule, MatMenuModule, CustomButtonComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
})
export class ListItemComponent {
  private dialog = inject(MatDialog);
  private playlistManager = inject(PlaylistManagerService);
  private utilsService = inject(UtilsService);
  private navigationService = inject(NavigationService);

  @Input() playlist!: Playlist;
  @Input() sidenavExpanded!: boolean;
  @Input() sidenavWidth!: number;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  public contextMenuPosition = { x: '0px', y: '0px' };
  public btnExpandedStyles = { width: '100%', padding: '8px' };
  public btnCollapsedStyles = { width: '48px', padding: 0 };

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

    dialogRef.afterClosed().subscribe((result) => { });
  }

  public openChangeDialog(): void {
    const dialogRef = this.dialog.open(DialogChangePlaylistDetailsComponent, {
      data: {
        id: this.playlist.id,
        name: this.playlist.name,
        description: this.playlist.description
      },
    });

    dialogRef.afterClosed().subscribe(async (result: DialogChangePlaylistDetailsData) => {
      if (result) {
        await this.playlistManager.changePlaylistDetails(result);
      }
    });
  }

  public truncateText(value: string): string {
    return this.utilsService.truncateText(value, 22);
  }
}
