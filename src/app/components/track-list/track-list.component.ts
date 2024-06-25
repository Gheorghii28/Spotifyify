import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { SoundwaveComponent } from '../soundwave/soundwave.component';
import { LikeButtonComponent } from '../buttons/like-button/like-button.component';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule, SoundwaveComponent, LikeButtonComponent],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
})
export class TrackListComponent implements OnInit, OnDestroy {
  @Input() track!: TrackFile;
  @Input() trackIndex!: number;
  public state!: StreamState;
  public files!: CloudFiles;
  public playingTrack!: TrackFile;
  private stateSubscription!: Subscription;
  private cloudSubscription!: Subscription;
  private playingTrackSubscription!: Subscription;

  constructor(
    public audioService: AudioService,
    private cloudService: CloudService
  ) {}

  ngOnInit(): void {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.cloudSubscription.unsubscribe();
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.stateSubscription = this.audioService
      .observeStreamState()
      .subscribe((state: StreamState) => {
        this.state = state;
      });
    this.cloudSubscription = this.cloudService
      .observeFiles()
      .subscribe((files: CloudFiles) => {
        this.files = files;
      });
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        this.playingTrack = track;
      });
  }

  public async togglePlayPause(event: Event): Promise<void> {
    event.stopPropagation();
    if (this.isCurrentPlayingTrack()) {
      this.audioService.togglePlayPause();
    } else {
      if (this.isCurrentPlaylist()) {
        const track: TrackFile = this.files.tracks[this.track.index];
        this.audioService.setPlayingTrack(track);
      } else {
        this.openPlaylist();
      }
    }
  }

  private async openPlaylist(): Promise<void> {
    await this.setCloudFiles();
    this.audioService.stop();
    this.audioService.setPlayingTrack(this.track);
  }

  private async setCloudFiles(): Promise<void> {
    const files: CloudFiles = await this.cloudService.getFiles(
      this.track.playlistId
    );
    this.cloudService.setFiles(files);
  }

  private isCurrentPlayingTrack(): boolean {
    if (!this.playingTrack) {
      return false;
    }
    return this.playingTrack.id === this.track.id;
  }

  private isCurrentPlaylist(): boolean {
    if (!this.files) {
      return false;
    }
    return this.files.id === this.track.playlistId;
  }
}
