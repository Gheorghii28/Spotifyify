import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TrackFile, TrackFileClass } from '../../models/cloud.model';
import { lastValueFrom, Subscription } from 'rxjs';
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
import { PlatformDetectionService } from '../../services/platform-detection.service';

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
    private spotifyService: SpotifyService,
    private platformDetectionService: PlatformDetectionService
  ) {}

  ngOnInit(): void {
    this.subscribeTo();
    if (this.platformDetectionService.isBrowser) {
      this.loadUserDefaultTrack();
    }
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
          if (track.playlistId) {
            this.loadPlaylistForCurrentTrack(track.playlistId);
          }
          this.loadArtists(track);
        }
      });
  }

  async loadUserDefaultTrack(): Promise<void> {
    try {
      const response: TracksObject = await lastValueFrom(
        this.spotifyService.getUsersSavedTracks()
      );
      const track: Track = response.items[0].track;
      this.playingTrack = new TrackFileClass(track, 0, '', undefined);
      this.loadArtists(this.playingTrack);
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  }

  async loadPlaylistForCurrentTrack(playlistId: string): Promise<void> {
    try {
      const response: Playlist = await lastValueFrom(
        this.spotifyService.getPlaylist(playlistId)
      );
      this.playlist = response;
    } catch (error) {
      console.error('Error loading playlist for current track', error);
    }
  }

  async loadArtists(track: TrackFile): Promise<void> {
    try {
      const artistIds: string[] = track.artists.map(
        (artist: { name: string; id: string }) => artist.id
      );
      const artistResults = await lastValueFrom(
        this.spotifyService.getArtist(artistIds)
      );
      this.artists = artistResults.artists;
    } catch (error) {
      console.error('Error loading artists', error);
    }
  }
}
