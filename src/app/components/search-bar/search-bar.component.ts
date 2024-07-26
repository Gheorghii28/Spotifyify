import { Component, EventEmitter, Output } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import {
  SpotifySearchResult,
  SpotifySearchResults,
} from '../../models/spotify.model';
import { debounce } from 'lodash';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  filterTypes: string[] = [
    'album',
    'artist',
    'playlist',
    'track',
    'show',
    'episode',
    'audiobook',
  ];
  @Output() searchResultsChange: EventEmitter<SpotifySearchResults | null> =
    new EventEmitter();

  constructor(private spotifyService: SpotifyService) {
    this.debouncedOnSearch = debounce(this.onSearch, 500);
  }

  public debouncedOnSearch(event: Event): void {}

  public async onSearch(event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    const searchQuery = inputElement.value.trim();
    if (searchQuery.length > 0) {
      try {
        const searchPromises = this.generateSearchPromises(searchQuery);
        const results = await Promise.all(searchPromises);
        const searchResults = this.mapSearchResults(results);
        this.searchResultsChange.emit(searchResults);
      } catch (error) {
        console.error('Error fetching search results: ', error);
      }
    } else {
      this.searchResultsChange.emit(null);
    }
  }

  private generateSearchPromises(
    searchQuery: string
  ): Promise<SpotifySearchResults>[] {
    const encodedQuery = encodeURIComponent(searchQuery);
    return this.filterTypes.map(
      (type: string): Promise<SpotifySearchResults> =>
        this.spotifyService.getSpotifyData(
          `search?q=${encodedQuery}&type=${type}&limit=10`
        )
    );
  }

  private mapSearchResults(results: any[]): SpotifySearchResults {
    return results.reduce((acc: SpotifySearchResults, res) => {
      const [propertyNames, propertyValues] = Object.entries(res)[0];
      acc[propertyNames as keyof SpotifySearchResults] =
        propertyValues as SpotifySearchResult;
      return acc;
    }, {});
  }
}
