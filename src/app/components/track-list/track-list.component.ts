import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { AudioService } from '../../services/audio.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { SoundwaveComponent } from '../soundwave/soundwave.component';
import { LikeButtonComponent } from '../buttons/like-button/like-button.component';
import { DomManipulationService } from '../../services/dom-manipulation.service';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [
    CommonModule,
    SoundwaveComponent,
    LikeButtonComponent,
    ResizeObserverDirective,
  ],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
})
export class TrackListComponent {
  @Input() track!: TrackFile;
  @Input() trackIndex!: number;
  @Input() files!: CloudFiles;
  @Input() state!: StreamState;
  @Input() playingTrack!: TrackFile;
  private readonly widthTrackNumber = 22;
  private readonly widthImg = 55;
  private readonly widthBtn = 65;
  private readonly widthLength = 40;
  private readonly margin = 15;

  constructor(
    public audioService: AudioService,
    private cloudService: CloudService,
    private domService: DomManipulationService
  ) {}

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
    if (this.track.playlistId) {
      await this.setCloudFiles();
    }
    this.audioService.stop();
    this.audioService.setPlayingTrack(this.track);
  }

  private async setCloudFiles(): Promise<void> {
    const files: CloudFiles = await this.cloudService.getFiles(
      this.track.playlistId as string
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

  public onResize(event: ResizeObserverEntry): void {
    const width = event.contentRect.width;
    const widthTitle = this.calculateWidthTitle(width);
    this.updateTitleWidth(widthTitle);
  }

  private updateTitleWidth(widthTitle: number): void {
    this.domService.applyStylesToElementByClass(
      'track-title',
      'width',
      `${widthTitle}px`
    );
  }

  private calculateWidthTitle(widthHost: number): number {
    return (
      widthHost -
      this.widthTrackNumber -
      this.widthImg -
      this.widthBtn -
      this.widthLength -
      this.margin
    );
  }
}
