import { Component, Input } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { CloudService } from '../../../services/cloud.service';
import { TracksObject } from '../../../models/spotify.model';
import { TrackFile } from '../../../models/cloud.model';
import { lastValueFrom, Subscription } from 'rxjs';
import { AudioService } from '../../../services/audio.service';

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
    private spotifyService: SpotifyService,
    private cloudService: CloudService,
    private audioService: AudioService
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

  // TODO: Implement functionality to enable/disable the toggle button
  public async toggleLiked(): Promise<void> {
    try {
      this.likedStatus
        ? await this.removeTrack(this.trackId)
        : await this.saveTrack(this.trackId);
      await this.updateLikedStatus(this.trackId);
      await this.setMyTracks();
    } catch (error) {
      console.error('Error toggling likedStatus status:', error);
    }
  }

  private async saveTrack(id: string): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.saveTracksForCurrentUser(id));
    } catch (error) {
      console.error('Error saving track:', error);
    }
  }

  private async removeTrack(id: string): Promise<void> {
    try {
      await lastValueFrom(this.spotifyService.removeUsersSavedTracks(id));
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }

  private async updateLikedStatus(id: string): Promise<void> {
    const likedStatusArr: boolean[] = await lastValueFrom(
      this.spotifyService.checkUsersSavedTracks([id])
    );
    this.likedStatus = likedStatusArr[0];
    if (this.playingTrack) {
      if (id === this.playingTrack.id) {
        this.playingTrack.likedStatus = likedStatusArr[0];
        this.audioService.setPlayingTrack(this.playingTrack);
      }
    }
    this.cloudService.updateLikedStatus(id, likedStatusArr[0]);
  }

  private async setMyTracks(): Promise<void> {
    const tracks: TracksObject = await lastValueFrom(
      this.spotifyService.getUsersSavedTracks()
    );
    this.cloudService.setMyTracks(tracks);
  }
}
