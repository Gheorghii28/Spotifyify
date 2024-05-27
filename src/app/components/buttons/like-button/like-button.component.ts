import { Component, Input } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { CloudService } from '../../../services/cloud.service';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss',
})
export class LikeButtonComponent {
  @Input() trackId!: string;
  @Input() likedStatus!: boolean;

  constructor(
    private spotifyService: SpotifyService,
    private cloudService: CloudService
  ) {}

  public async toogleLiked(): Promise<void> {
    if (this.likedStatus) {
      await this.removeTrack(this.trackId);
    } else {
      await this.saveTrack(this.trackId);
    }
    this.updateLikedStatus(this.trackId);
  }

  private async updateLikedStatus(id: string): Promise<void> {
    const likedStatus = await this.spotifyService.fetchLikedStatusForTrack(id);
    this.cloudService.updateLikedStatus(id, likedStatus);
  }

  private async saveTrack(id: string): Promise<void> {
    try {
      const res = await this.spotifyService.updateSpotifyData(
        `me/tracks?ids=${id}`
      );
    } catch (error) {
      console.error('Error saving track:', error);
    }
  }

  private async removeTrack(id: string): Promise<void> {
    try {
      const res = await this.spotifyService.removeSpotifyData(
        `me/tracks?ids=${id}`
      );
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }
}
