import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../services/audio.service';
import { MatButtonModule } from '@angular/material/button';
import { CloudService } from '../../../services/cloud.service';
import { CloudFiles, TrackFile } from '../../../models/cloud.model';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-btn-play',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './btn-play.component.html',
  styleUrl: './btn-play.component.scss',
})
export class BtnPlayComponent {
  @Input() playlistId!: string;

  constructor(
    public audioService: AudioService,
    private cloudService: CloudService,
    private spotifyService: SpotifyService,
  ) { }

  public togglePlayPause(event: Event): void {
    event.stopPropagation();
    if (this.isCurrentPlaylist()) {
      this.audioService.togglePlayPause();
    } else {
      this.openPlaylist();
    }
  }

  private async openPlaylist(): Promise<void> {
    this.audioService.stop();
    const files: CloudFiles = await this.cloudService.getFiles(this.playlistId);
    this.cloudService.files.set(files);
    await this.spotifyService.loadPreviewUrlIfMissing(files.tracks[0]);
    const track: TrackFile = await this.audioService.getPlayingTrack(files, 0);
    this.audioService.currentPlayingTrack.set(track);
  }

  private async setCloudFiles(): Promise<void> {
    const files: CloudFiles = await this.cloudService.getFiles(this.playlistId);
    this.cloudService.files.set(files);
  }

  private isCurrentPlaylist(): boolean {
    if (!this.audioService.currentPlayingTrack()) {
      return false;
    }
    return this.audioService.currentPlayingTrack().playlistId === this.playlistId;
  }
}
