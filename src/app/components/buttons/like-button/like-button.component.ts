import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackFile } from '../../../models/cloud.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../../services/audio.service';
import { LikedStatusService } from '../../../services/liked-status.service';
import { LottieAnimationComponent } from '../../lottie-animation/lottie-animation.component';

@Component({
  selector: 'app-like-button',
  imports: [CommonModule, LottieAnimationComponent],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss',
})
export class LikeButtonComponent {
  @Input() trackId!: string;
  @Input() likedStatus!: boolean;

  public playingTrack!: TrackFile;
  private playingTrackSubscription!: Subscription;

  public heartAnimationConfig = {
    path: '/assets/animations/heart-like.json',
    action: this.likedStatus ? 'like' : 'unlike',
    frameMap: {
      like: [0, 70],
      unlike: [70, 130],
      idle: [70]
    },
    width: '50px',
    height: '50px',
    loop: false,
    autoplay: false,
    statusType: 'likedStatus'
  };
  
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
