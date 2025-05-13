import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogRemovePlaylistData } from '../../../models/dialog.model';
import { PlaylistManagerService } from '../../../layout/services/playlist-manager.service';
import { NavigationService, UserService } from '../../../services';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-dialog-remove-playlist',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dialog-remove-playlist.component.html',
  styleUrl: './dialog-remove-playlist.component.scss',
})
export class DialogRemovePlaylistComponent {
  private playlistManager = inject(PlaylistManagerService);
  private userService = inject(UserService);
  private navigationService = inject(NavigationService);
  private snackbar = inject(SnackbarService);

  constructor(
    public dialogRef: MatDialogRef<DialogRemovePlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogRemovePlaylistData,
  ) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async removePlaylist(): Promise<void> {
    try {
      const user = this.userService.user()!;
      await this.snackbar.runWithSnackbar(
        this.playlistManager.removePlaylist(user.id, this.data.id),
        'Playlist deleted successfully!'
      );
      if (this.isCurrentPlaylist()) {
        this.navigationService.home();
      }
      this.onNoClick();
    } catch (error) {
      console.error('Error removing playlist:', error);
    }
  }

  private isCurrentPlaylist(): boolean {
    const currentUrl = this.navigationService.getCurrentUrl();
    const isPlaylistInUrl = (playlistId: string) =>
      currentUrl.includes(playlistId);
    return isPlaylistInUrl(this.data.id);
  }
}
