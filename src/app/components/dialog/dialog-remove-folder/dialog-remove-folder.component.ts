import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRemoveFolderData } from '../../../models/dialog.model';
import { Playlist } from '../../../models';
import { UserFolder } from '../../../models/user.model';
import { PlaylistManagerService } from '../../../layout/services/playlist-manager.service';
import { NavigationService } from '../../../services';

@Component({
  selector: 'app-dialog-remove-folder',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dialog-remove-folder.component.html',
  styleUrl: './dialog-remove-folder.component.scss',
})
export class DialogRemoveFolderComponent {
  private playlistManager = inject(PlaylistManagerService);
  private navigationService = inject(NavigationService);
  
  constructor(
    public dialogRef: MatDialogRef<DialogRemoveFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRemoveFolderData,
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removeFolder(): Promise<void> {
    try {
      const folderToRemove: UserFolder = this.data.folder;
      this.playlistManager.removePlaylistFolder(this.data.user.id, folderToRemove.id);
      if (this.isCurrentPlaylistInDeletedFolder(folderToRemove)) {
        this.navigationService.home();
      }
      this.onNoClick();
    } catch (error) {
      console.error('Error removing folder:', error);
    }
  }

  private isCurrentPlaylistInDeletedFolder(
    folderToRemove: UserFolder
  ): boolean {
    const currentUrl = this.navigationService.getCurrentUrl();
    const isPlaylistInUrl = (playlistId: string) =>
      currentUrl.includes(playlistId);
    return folderToRemove.playlists.some((playlist: Playlist) =>
      isPlaylistInUrl(playlist.id)
    );
  }
}
