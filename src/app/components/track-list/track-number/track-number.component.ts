import { Component, Input } from '@angular/core';
import { StreamState } from '../../../models/stream-state.model';
import { AudioService } from '../../../services/audio.service';
import { CloudFiles, TrackFile } from '../../../models/cloud.model';
import { CloudService } from '../../../services/cloud.service';
import { SoundwaveComponent } from '../../soundwave/soundwave.component';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-track-number',
  standalone: true,
  imports: [CommonModule, SoundwaveComponent],
  templateUrl: './track-number.component.html',
  styleUrl: './track-number.component.scss',
})
export class TrackNumberComponent {
  @Input() state!: StreamState;
  @Input() trackIndex!: number;
  @Input() files!: CloudFiles;
  @Input() track!: TrackFile;
  @Input() playingTrack!: TrackFile;
  @Input() isHovered: boolean = false;

  constructor(
    public audioService: AudioService,
    private cloudService: CloudService,
    private spotifyService: SpotifyService,
  ) {}

  public async togglePlayPause(event: Event): Promise<void> {
    event.stopPropagation();
    await this.spotifyService.loadPreviewUrlIfMissing(this.track);
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
}
