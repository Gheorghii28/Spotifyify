import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Album, Artist, Playlist, Track } from '../models';
import { SpotifyService } from './spotify.service';
import { lastValueFrom } from 'rxjs';
import { PlaylistMapper } from '../mappers';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private spotifyService = inject(SpotifyService);

  searchQuery: WritableSignal<string> = signal('');
  searchResults: WritableSignal<{
    playlists: Playlist[];
    albums: Album[];
    artists: Artist[];
    tracks: Track[];
  }> = signal({
    playlists: [],
    albums: [],
    artists: [],
    tracks: []
  });
  searchResultPlaylist: WritableSignal<Playlist | null> = signal(null);

  constructor() {
    effect(() => {
      const query = this.searchQuery();
      if (query.trim().length > 0) {
        this.loadSearchResults(query);
      }
    });
  }

  public search(query: string): void {
    this.searchQuery.set(query);
  }

  private async loadSearchResults(query: string): Promise<void> {
    const playlists = await lastValueFrom(
      this.spotifyService.searchByType<Playlist>(query, 'playlist')
    );
    const albums = await lastValueFrom(
      this.spotifyService.searchByType<Album>(query, 'album')
    );
    const artists = await lastValueFrom(
      this.spotifyService.searchByType<Artist>(query, 'artist')
    );
    const tracks = await lastValueFrom(
      this.spotifyService.searchByType<Track>(query, 'track')
    );
    this.searchResults.update(
      () => ({
        playlists: playlists,
        albums: albums,
        artists: artists,
        tracks: tracks
      })
    );
    this.searchResultPlaylist.set(PlaylistMapper.createDefault('Search Results', tracks));
  }
}
