import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TrackFile, TrackFileClass } from '../../models/cloud.model';
import { Subscription } from 'rxjs';
import { AudioService } from '../../services/audio.service';
import {
  Artist,
  Playlist,
  Track,
  TracksObject,
} from '../../models/spotify.model';
import { SpotifyService } from '../../services/spotify.service';
import { CommonModule } from '@angular/common';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';
import { TrackInfoComponent } from './track-info/track-info.component';
import { ArtistInfoComponent } from './artist-info/artist-info.component';

@Component({
  selector: 'app-playing-info',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    CustomScrollbarDirective,
    TrackInfoComponent,
    ArtistInfoComponent,
  ],
  templateUrl: './playing-info.component.html',
  styleUrl: './playing-info.component.scss',
})
export class PlayingInfoComponent implements OnInit, OnDestroy {
  public playingTrack!: TrackFile;
  public playlist!: Playlist;
  public artists!: Artist[];
  private playingTrackSubscription!: Subscription;

  constructor(
    public audioService: AudioService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.subscribeTo();
    this.loadUserDefaultTrack();
  }

  ngOnDestroy(): void {
    this.playingTrackSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.playingTrackSubscription = this.audioService
      .observePlayingTrack()
      .subscribe((track: TrackFile) => {
        if (track) {
          this.playingTrack = track;
          this.loadPlaylistForCurrentTrack(track);
          this.loadArtists(track);
        }
      });
  }

  async loadUserDefaultTrack(): Promise<void> {
    const tracks: TracksObject = await this.spotifyService.retrieveSpotifyData(
      `me/tracks`
    );
    if (tracks.items) {
      const track: Track = tracks.items[0].track;
      this.playingTrack = new TrackFileClass(track, 0, '');
      this.loadArtists(this.playingTrack);
    }
  }

  async loadPlaylistForCurrentTrack(track: TrackFile): Promise<void> {
    this.playlist = await this.spotifyService.retrieveSpotifyData(
      `playlists/${track.playlistId}`
    );
  }

  async loadArtists(track: TrackFile): Promise<void> {
    const artistPromises = track.artists.map(async (artist) => {
      return this.spotifyService.retrieveSpotifyData(`artists/${artist.id}`);
    });
    const artistResults = (await Promise.all(artistPromises)) as Artist[];
    this.artists = artistResults;
  }
}
