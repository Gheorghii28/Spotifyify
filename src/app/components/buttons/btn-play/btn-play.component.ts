import { Component, Input, OnDestroy } from '@angular/core';
import { StreamState } from '../../../models/stream-state.model';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../services/audio.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { CloudService } from '../../../services/cloud.service';
import { CloudFiles, TrackFile } from '../../../models/cloud.model';

@Component({
  selector: 'app-btn-play',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './btn-play.component.html',
  styleUrl: './btn-play.component.scss',
})
export class BtnPlayComponent implements OnDestroy {
  @Input() playlistId!: string;
  public state!: StreamState;
  public playingTrack!: TrackFile;
  private stateSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;

  constructor(
    public audioService: AudioService,
    private cloudService: CloudService
  ) {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.stateSubscription = this.audioService
      .observeStreamState()
      .subscribe((state: StreamState) => {
        this.state = state;
      });
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        this.playingTrack = track;
      });
  }

  public togglePlayPause(event: Event): void {
    event.stopPropagation();
    if (this.isCurrentPlaylist()) {
      this.audioService.togglePlayPause();
    } else {
      this.openPlaylist();
    }
  }

  private async openPlaylist(): Promise<void> {
    await this.setCloudFiles();
    this.audioService.stop();
    const files: CloudFiles = await this.cloudService.getFiles(this.playlistId);
    const track: TrackFile = await this.audioService.getPlayingTrack(files, 0);
    this.audioService.setPlayingTrack(track);
  }

  private async setCloudFiles(): Promise<void> {
    const files: CloudFiles = await this.cloudService.getFiles(this.playlistId);
    this.cloudService.setFiles(files);
  }

  private isCurrentPlaylist(): boolean {
    if (!this.playingTrack) {
      return false;
    }
    return this.playingTrack.playlistId === this.playlistId;
  }
}
