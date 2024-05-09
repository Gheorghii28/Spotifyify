import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PlayingTrack,
  PlayingTrackClass,
  StreamState,
} from '../../models/stream-state.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { SoundwaveComponent } from '../soundwave/soundwave.component';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule, SoundwaveComponent],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
})
export class TrackListComponent implements OnInit, OnDestroy {
  @Input() track!: TrackFile;
  @Input() trackIndex!: number;
  @Input() playListId!: string;
  public state!: StreamState;
  private files!: CloudFiles;
  public playingTrack!: PlayingTrack;
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
      .subscribe((track: PlayingTrack) => {
        this.playingTrack = track;
      });
  }

  public async togglePlayPause(event: Event): Promise<void> {
    event.stopPropagation();
    if (this.isCurrentPlayingTrack()) {
      this.audioService.togglePlayPause();
    } else {
      if (this.isCurrentPlayList()) {
        const track: TrackFile = this.files.tracks[this.trackIndex];
        const playingTrack = new PlayingTrackClass(
          this.playListId,
          track.id,
          track.index
        );
        this.audioService.setPlayingTrack(playingTrack);
      } else {
        this.openPlayList();
      }
    }
  }

  private async openPlayList(): Promise<void> {
    await this.setCloudFiles();
    this.audioService.stop();
    const files: CloudFiles = await this.cloudService.getFiles(
      this.playListId
    );
    const playingTrack: PlayingTrack = await this.audioService.getPlayingTrack(
      files,
      this.playListId,
      this.trackIndex
    );
    this.audioService.setPlayingTrack(playingTrack);
  }

  private async setCloudFiles(): Promise<void> {
    const files: CloudFiles = await this.cloudService.getFiles(
      this.playListId
    );
    this.cloudService.setFiles(files);
  }

  private isCurrentPlayingTrack(): boolean {
    return this.playingTrack.id === this.track.id;
  }

  private isCurrentPlayList(): boolean {
    if (!this.files) {
      return false;
    }
    return this.files.id === this.playListId;
  }
}
