import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';
import { HeaderPlayingInfoComponent } from './header-playing-info/header-playing-info.component';
import { TrackInfoComponent } from './track-info/track-info.component';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { Artist, Track } from '../../models';
import { AudioService } from '../../services';
import { PlaylistManagerService } from '../services/playlist-manager.service';

@Component({
  selector: 'app-playing-info',
  imports: [
    CommonModule,
    CustomScrollbarDirective,
    HeaderPlayingInfoComponent,
    TrackInfoComponent,
    ArtistInfoComponent,
  ],
  templateUrl: './playing-info.component.html',
  styleUrl: './playing-info.component.scss',
})
export class PlayingInfoComponent {
  private audioService = inject(AudioService);
  private playlistManager = inject(PlaylistManagerService);
  artistsList: Artist[] = [];

  constructor() {
    effect(() => {
      this.loadArtists();
    });
  }

  private async loadArtists(): Promise<void> {
    if (this.audioService.playingTrack()?.artists[0].imageUrl?.length === 0) {
      this.artistsList = await this.playlistManager.loadArtists(this.audioService.playingTrack()!);
    }
    else {
      this.artistsList = this.audioService.playingTrack()?.artists || [];
    }
  }

  public get playingTrack(): Track {
    return this.audioService.playingTrack()!;
  }
}
