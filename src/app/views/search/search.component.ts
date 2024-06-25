import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import {
  Playlist,
  SpotifySearchResults,
  UserProfile,
} from '../../models/spotify.model';
import { CommonModule, Location } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { TrackFile, TrackFileClass } from '../../models/cloud.model';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchBarComponent,
    CommonModule,
    TrackListComponent,
    CardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  public userProfile!: UserProfile;
  tracks: TrackFile[] = [];
  playlists: Playlist[] = [];

  constructor(private location: Location) {}

  ngOnInit() {
    this.setUserProfileFromState();
  }

  private setUserProfileFromState(): void {
    const state = this.location.getState() as any;
    this.userProfile = state?.user;
  }

  public onSearchResultsChange(results: SpotifySearchResults | null): void {
    this.tracks = [];
    this.playlists = [];
    if (results) {
      this.tracks =
        results.tracks?.items.map(
          (track) => new TrackFileClass(track, 0, '')
        ) || [];
      this.playlists = results.playlists?.items || [];
    }
  }
}
