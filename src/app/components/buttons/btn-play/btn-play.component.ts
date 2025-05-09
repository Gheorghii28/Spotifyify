import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Playlist, Track } from '../../../models';
import { firstValueFrom } from 'rxjs';
import { StreamState } from '../../../models/stream-state.model';
import { AudioService, DrawerService, SpotifyService } from '../../../services';

@Component({
  selector: 'app-btn-play',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './btn-play.component.html',
  styleUrl: './btn-play.component.scss',
})
export class BtnPlayComponent {
  private audioService = inject(AudioService);
  private spotifyService = inject(SpotifyService);
  private drawerService = inject(DrawerService);

  @Input() playlist!: Playlist;

  public get playingTrack(): Track | null {
    return this.audioService.playingTrack();
  }

  public get state(): StreamState {
    return this.audioService.state();
  }

  public async onPlayPauseClicked(event: Event): Promise<void> {
    event.stopPropagation();
  
    // If the playlist has no tracks loaded yet, fetch them from the Spotify API
    if (this.playlist.tracks.length === 0) {
      this.playlist.tracks = await firstValueFrom(
        this.spotifyService.getPlaylistTracks(this.playlist.id)
      );
    }
  
    // By default, select the first track from the playlist
    let track = this.playlist.tracks[0];
    // If a track from this playlist is already playing, use that track instead
    if (this.audioService.playingTrack()?.playlistId === this.playlist.id) {
      track = this.audioService.playingTrack() as Track;
    }
  
    await this.audioService.prepareAndPlayTrack(
      this.playlist,
      track
    );
    this.drawerService.handlePlayButtonClick();
  }
}
