import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackFile } from '../../../models/cloud.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../../services/audio.service';
import { LikedStatusService } from '../../../services/liked-status.service';

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

  public playingTrack!: TrackFile;
  private playingTrackSubscription!: Subscription;

  constructor(
    private audioService: AudioService,
    private likedStatusService: LikedStatusService
  ) {}

  ngOnInit(): void {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        if (track) {
          this.playingTrack = track;
        }
      });
  }

  public async toggleLiked(): Promise<void> {
    try {
      this.likedStatus
        ? await this.likedStatusService.removeTrack(this.trackId)
        : await this.likedStatusService.saveTrack(this.trackId);
      await this.likedStatusService.checkAndUpdateLikedStatus(this.trackId, this.playingTrack);
      await this.likedStatusService.updateUserSavedTracks();
    } catch (error) {
      console.error('Error toggling likedStatus status:', error);
    }
  }
}
