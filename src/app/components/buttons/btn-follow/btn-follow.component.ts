import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-btn-follow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-follow.component.html',
  styleUrl: './btn-follow.component.scss',
})
export class BtnFollowComponent {
  @Input() isFollowing!: boolean;
  @Input() playlistId!: string;
  isDisabled: boolean = false;

  constructor(private spotifyService: SpotifyService) {}

  public async toggleFollowing(): Promise<void> {
    if (!this.playlistId) return;
    this.isDisabled = true;
    try {
      this.isFollowing
        ? await this.unfollowPlaylist(this.playlistId)
        : await this.followPlaylist(this.playlistId);
      this.isFollowing = await this.spotifyService.getPlaylistFollowStatus(
        this.playlistId
      );
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      this.isDisabled = false;
    }
  }

  private async followPlaylist(id: string): Promise<void> {
    try {
      await this.spotifyService.updateSpotifyData(`playlists/${id}/followers`, {
        public: false,
      });
    } catch (eror) {
      console.error('Error following playlist:', eror);
    }
  }

  private async unfollowPlaylist(id: string): Promise<void> {
    try {
      await this.spotifyService.removeSpotifyData(`playlists/${id}/followers`);
    } catch (error) {
      console.error('Error unfollowing playlist:', error);
    }
  }
}
