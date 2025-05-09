import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieAnimationComponent } from '../../lottie-animation/lottie-animation.component';
import { lastValueFrom } from 'rxjs';
import { LikedTracksService, SpotifyService } from '../../../services';

@Component({
  selector: 'app-like-button',
  imports: [CommonModule, LottieAnimationComponent],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss',
})
export class LikeButtonComponent {

  private likedTracksService = inject(LikedTracksService);
  private spotifyService = inject(SpotifyService);

  @Input() trackId!: string | undefined;
  @Input() likedStatus!: boolean;

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

  public async toggleLiked(): Promise<void> {
    this.likedTracksService.toggleLike(this.trackId as string);
    if (this.likedStatus) {
      await lastValueFrom(
        this.spotifyService.removeUsersSavedTracks(this.trackId as string)
      );
    } else {
      await lastValueFrom(
        this.spotifyService.saveTracksForCurrentUser(this.trackId as string)
      );
    }
  }
}
