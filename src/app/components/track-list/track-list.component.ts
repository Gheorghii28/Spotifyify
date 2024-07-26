import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { AudioService } from '../../services/audio.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { SoundwaveComponent } from '../soundwave/soundwave.component';
import { LikeButtonComponent } from '../buttons/like-button/like-button.component';
import { DomManipulationService } from '../../services/dom-manipulation.service';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule, SoundwaveComponent, LikeButtonComponent],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
})
export class TrackListComponent implements OnDestroy, AfterViewInit {
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
  private observer!: ResizeObserver;

  constructor(
    public audioService: AudioService,
    private cloudService: CloudService,
    private domService: DomManipulationService,
    private host: ElementRef,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.initializeResizeObserver();
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.host.nativeElement);
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

  private initializeResizeObserver(): void {
    this.observer = new ResizeObserver((entries) => this.handleResize(entries));
    this.observer.observe(this.host.nativeElement);
  }

  private handleResize(entries: ResizeObserverEntry[]): void {
    if (entries.length === 0) return;

    const entry = entries[0];
    const widthHost = entry.contentRect.width;
    const widthTitle = this.calculateWidthTitle(widthHost);

    this.zone.run(() => this.updateTitleWidth(widthTitle));
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
