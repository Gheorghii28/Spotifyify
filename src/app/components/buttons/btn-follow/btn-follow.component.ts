import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SpotifyService } from '../../../services';

@Component({
  selector: 'app-btn-follow',
  imports: [CommonModule],
  templateUrl: './btn-follow.component.html',
  styleUrl: './btn-follow.component.scss',
})
export class BtnFollowComponent {
  private spotifyService = inject(SpotifyService);

  @Input() isFollowing!: boolean;
  @Input() playlistId!: string;
  isDisabled: boolean = false;

  public async toggleFollowing(): Promise<void> {
    if (!this.playlistId) return;
    this.isDisabled = true;
    try {
      this.isFollowing
        ? await this.unfollowPlaylist(this.playlistId)
        : await this.followPlaylist(this.playlistId);
      this.isFollowing = await this.getPlaylistFollowStatus(this.playlistId);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      this.isDisabled = false;
    }
  }

  private async followPlaylist(id: string): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.followPlaylist(id));
    } catch (error) {
      console.error('Error follow playlist:', error);
    }
  }

  private async unfollowPlaylist(id: string): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.unfollowPlaylist(id));
    } catch (error) {
      console.error('Error unfollow playlist:', error);
    }
  }

  private async getPlaylistFollowStatus(id: string): Promise<boolean> {
    if (id.length > 0) {
      const response: boolean = await lastValueFrom(
        this.spotifyService.checkIfCurrentUserFollowsPlaylist(id)
      );
      const isFollowing = response;
      return isFollowing;
    }
    return false;
  }
}
