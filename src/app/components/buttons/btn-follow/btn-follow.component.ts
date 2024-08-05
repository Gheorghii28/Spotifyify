import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { lastValueFrom } from 'rxjs';

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
      const response: boolean[] = await lastValueFrom(
        this.spotifyService.checkIfCurrentUserFollowsPlaylist(id)
      );
      const isFollowing = response[0];
      return isFollowing;
    }
    return false;
  }
}
