import { Component, Input, OnDestroy } from '@angular/core';
import { PlayingTrack, StreamState } from '../../models/stream-state.model';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { CloudService } from '../../services/cloud.service';
import { CloudFiles } from '../../models/cloud.model';

@Component({
  selector: 'app-btn-play',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './btn-play.component.html',
  styleUrl: './btn-play.component.scss',
})
export class BtnPlayComponent implements OnDestroy {
  @Input() playListId!: string;
  public state!: StreamState;
  public playingTrack!: PlayingTrack;
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
      .subscribe((track: PlayingTrack) => {
        this.playingTrack = track;
      });
  }

  public togglePlayPause(event: Event): void {
    event.stopPropagation();
    if (this.isCurrentPlayList()) {
      this.audioService.togglePlayPause();
    } else {
      this.openPlayList();
    }
  }

  private async openPlayList(): Promise<void> {
    await this.setCloudFiles();
    this.audioService.stop();
    const files: CloudFiles = await this.cloudService.getFiles(this.playListId);
    const track: PlayingTrack = await this.audioService.getPlayingTrack(
      files,
      this.playListId,
      0
    );
    this.audioService.setPlayingTrack(track);
  }

  private async setCloudFiles(): Promise<void> {
    const files: CloudFiles = await this.cloudService.getFiles(this.playListId);
    this.cloudService.setFiles(files);
  }

  private isCurrentPlayList(): boolean {
    return this.playingTrack.playListId === this.playListId;
  }
}
