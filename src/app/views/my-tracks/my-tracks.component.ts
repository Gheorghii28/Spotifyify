import { Component, inject, OnInit } from '@angular/core';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';
import { Playlist, Track } from '../../models';
import { PlaylistMapper } from '../../mappers';
import { StreamState } from '../../models/stream-state.model';
import { firstValueFrom } from 'rxjs';
import { AudioService, SpotifyService } from '../../services';

@Component({
  selector: 'app-my-tracks',
  imports: [
    ViewHeaderComponent,
    TrackListHeaderComponent,
    TrackListComponent,
    CommonModule,
  ],
  templateUrl: './my-tracks.component.html',
  styleUrl: './my-tracks.component.scss',
})
export class MyTracksComponent implements OnInit {
  private spotifyService = inject(SpotifyService);
  private audioService = inject(AudioService);
  playlist!: Playlist;

  async ngOnInit() {
    this.playlist = await this.getPlaylist();
  }

  private async getPlaylist(): Promise<Playlist> {
    const tracks = await firstValueFrom(this.spotifyService.getUsersSavedTracks());
    return PlaylistMapper.createDefault('Liked Songs', tracks, 'Playlist');
  }

  public get playingTrack(): Track | null {
    return this.audioService.playingTrack();
  }

  public get state(): StreamState {
    return this.audioService.state();
  }
}
