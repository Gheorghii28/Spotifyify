import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Album, Artist, Playlist, SearchResults, Track } from '../models';
import { SpotifyService } from './spotify.service';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { PlaylistMapper } from '../mappers';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private spotifyService = inject(SpotifyService);

  overlayOpen: WritableSignal<boolean> = signal(false);
  recentSearches: WritableSignal<string[]> = signal(JSON.parse(window.localStorage.getItem('recentSearches') ?? '[]'));
  searchTerm: WritableSignal<string> = signal('');
  emptyResults: SearchResults = {
    playlists: [],
    albums: [],
    artists: [],
    tracks: []
  }
  searchResults: WritableSignal<SearchResults> = signal(this.emptyResults);
  searchResultPlaylist: WritableSignal<Playlist | null> = signal(null);
  isLoading: WritableSignal<boolean> = signal(false);
  saveLocalStorage = effect(() => {
    window.localStorage.setItem(
      'recentSearches',
      JSON.stringify(this.recentSearches())
    );
  });

  public async search(searchTerm: string): Promise<void> {
    this.isLoading.set(true);
    this.overlayOpen.set(false);
    this.searchTerm.set(searchTerm);
    this.addToRecentSearches(searchTerm);
    const results = await this.loadSearchResults(searchTerm);
    this.searchResults.set(results);
    this.isLoading.set(false);
  }

  public clearSearch(): void {
    this.searchTerm.set('');
    if(this.recentSearches().length === 0) return;
    this.overlayOpen.set(true);
  }


  private addToRecentSearches(searchTerm: string): void {
    if (!searchTerm) return;
    const lowerCaseTerm = searchTerm.trim().toLowerCase();
    this.recentSearches.set([
      lowerCaseTerm,
      ...this.recentSearches().filter((s) => s !== lowerCaseTerm)
    ]);
  }

  public deleteRecentSearch(searchTerm: string): void {
    const updatedSearches = this.recentSearches().filter((s) => s !== searchTerm);
    this.recentSearches.set(updatedSearches);
    if (updatedSearches.length === 0) {
      this.overlayOpen.set(false);
    }
  }

  private async loadSearchResults(searchTerm: string): Promise<SearchResults> {
    if (!searchTerm) {
      return this.emptyResults;
    }

    const playlists$ = this.spotifyService.searchByType<Playlist>(searchTerm, 'playlist');
    const albums$ = this.spotifyService.searchByType<Album>(searchTerm, 'album');
    const artists$ = this.spotifyService.searchByType<Artist>(searchTerm, 'artist');
    const tracks$ = this.spotifyService.searchByType<Track>(searchTerm, 'track');

    const results = await lastValueFrom(
      forkJoin([playlists$, albums$, artists$, tracks$]).pipe(
        map(([playlists, albums, artists, tracks]) => {
          const result: SearchResults = { playlists, albums, artists, tracks };
          this.searchResultPlaylist.set(
            PlaylistMapper.createDefault('Search Results', tracks)
          );
          return result;
        })
      )
    );

    return results;
  }
}
