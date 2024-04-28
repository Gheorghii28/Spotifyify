import { Component, Input, OnDestroy } from '@angular/core';
import { StreamState } from '../../models/stream-state.model';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { CloudService } from '../../services/cloud.service';
import {
  CloudFiles,
  CloudFilesClass,
  TrackFile,
  TrackFileClass,
} from '../../models/cloud.model';
import { Playlist } from '../../models/spotify.model';

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
  public currentPlaylistId!: string;
  private files!: CloudFiles;
  private cloudSubscription!: Subscription;
  private stateSubscription!: Subscription;
  private currentPlaylistIdSubscription!: Subscription;

  constructor(
    public audioService: AudioService,
    private spotifyService: SpotifyService,
    private cloudService: CloudService
  ) {
    this.subscribeTo();
  }

  ngOnDestroy(): void {
    this.cloudSubscription.unsubscribe();
    this.stateSubscription.unsubscribe();
    this.currentPlaylistIdSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.cloudSubscription = this.cloudService.getFiles().subscribe((files) => {
      this.files = files;
    });
    this.stateSubscription = this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
    this.currentPlaylistIdSubscription = this.audioService
      .getCurrentPlaylistId()
      .subscribe((playListId) => {
        this.currentPlaylistId = playListId;
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
    const url: string = this.audioService.getFileUrl(this.files, 0);
    this.audioService
      .playStream(url, this.playListId)
      .subscribe((events) => {});
  }

  private async setCloudFiles(): Promise<void> {
    const playList: Playlist = await this.spotifyService.getSpotifyData(
      `playlists/${this.playListId}`
    );
    const tracks: TrackFile[] = this.extractPlayableTracks(playList);
    const currentFiles: CloudFiles = new CloudFilesClass(playList, tracks);
    this.cloudService.setFiles(currentFiles);
  }

  private extractPlayableTracks(playList: Playlist): TrackFile[] {
    return playList.tracks.items
      .filter((item) => item.track && item.track.preview_url)
      .map((item, index) => new TrackFileClass(item.track, index));
  }

  private isCurrentPlayList(): boolean {
    return this.currentPlaylistId === this.playListId;
  }
}
