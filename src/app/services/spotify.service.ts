import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  DialogAddTrackData,
  DialogChangePlaylistDetailsData,
  DialogRemoveTrackData,
} from '../models/dialog.model';
import { TrackFile } from '../models/cloud.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private readonly apiUrl: string = 'https://api.spotify.com/v1/';
  private readonly previewFetcherBaseUrl: string = environment.previewFetchUrl;

  constructor(private http: HttpClient) {}

  // --- Users ---
  public getCurrentUsersProfile(): Observable<any> {
    const url = `${this.apiUrl}me`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error Get Current Users Profile:', error);
        return throwError(
          () => new Error('Failed to Get Current Users Profile')
        );
      })
    );
  }

  public followPlaylist(playlistId: string): Observable<any> {
    const url = `${this.apiUrl}playlists/${playlistId}/followers`;
    const body = {
      public: false,
    };
    return this.http.put(url, body).pipe(
      catchError((error) => {
        console.error(`Error follow playlist:`, error);
        return throwError(() => new Error(`Failed to follow playlist`));
      })
    );
  }

  public unfollowPlaylist(playlistId: string): Observable<any> {
    const url = `${this.apiUrl}playlists/${playlistId}/followers`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error(`Error unfollow playlist:`, error);
        return throwError(() => new Error(`Failed to unfollow playlist`));
      })
    );
  }
  
  public followArtistsorUsers(followIds: string[], followType: string): Observable<any> {
    const url = `${this.apiUrl}me/following?type=${followType}&ids=${followIds.join(',')}`;
    return this.http.put(url, {}).pipe(
      catchError((error) => {
        console.error(`Error following artists or users:`, error);
        return throwError(() => new Error(`Failed to follow artists or users`));
      })
    );
  }
  
  public unfollowArtistsorUsers(followIds: string[], followType: string): Observable<any> {
    const url = `${this.apiUrl}me/following?type=${followType}`;
    const body = {
      ids: followIds,
    };
    const options = {
      body: body,
    };
    return this.http.request('delete', url, options).pipe(
      catchError((error) => {
        console.error(`Error unfollowing artists or users:`, error);
        return throwError(() => new Error(`Failed to unfollow artists or users`));
      })
    );
  }

  public checkIfCurrentUserFollowsPlaylist(
    playlistId: string
  ): Observable<any> {
    const url: string = `${this.apiUrl}playlists/${playlistId}/followers/contains`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error Check if Current User Follows Playlist:`, error);
        return throwError(
          () => new Error(`Failed to Check if Current User Follows Playlist`)
        );
      })
    );
  }

  public checkIfCurrentUserFollowsArtistsorUsers(
    ids: string[], type: string
  ): Observable<any> {
    const url: string = `${this.apiUrl}me/following/contains?type=${type}&ids=${ids.join(',')}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error Check if Current User Follows Artists or Users:`, error);
        return throwError(
          () => new Error(`Failed to Check if Current User Follows Artists or Users`)
        );
      })
    );
  }

  // --- Playlists ---
  public getPlaylist(playlistId: string): Observable<any> {
    const url: string = `${this.apiUrl}playlists/${playlistId}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error Get Playlist (playlistId:${playlistId}):`, error);
        return throwError(
          () => new Error(`Failed to Get Playlist (playlistId:${playlistId})`)
        );
      })
    );
  }

  public addItemsToPlaylist(
    playlistId: string,
    data: DialogAddTrackData
  ): Observable<any> {
    const url = `${this.apiUrl}playlists/${playlistId}/tracks`;
    const body = {
      uris: [data.uri],
      position: data.position,
    };
    return this.http.post(url, body).pipe(
      catchError((error) => {
        console.error('Error adding items to playlist:', error);
        return throwError(() => new Error('Failed to add items to playlist'));
      })
    );
  }

  public removePlaylisItems(
    playlistId: string,
    data: DialogRemoveTrackData
  ): Observable<any> {
    const url = `${this.apiUrl}playlists/${playlistId}/tracks`;
    const body = {
      tracks: [
        {
          uri: data.uri,
        },
      ],
      snapshot_id: data.snapshot_id,
    };
    const options = {
      body: body,
    };
    return this.http.request('delete', url, options).pipe(
      catchError((error) => {
        console.error('Error deleting items from playlist:', error);
        return throwError(
          () => new Error('Failed to delete items from playlist')
        );
      })
    );
  }

  public getCurrentUsersPlaylists(): Observable<any> {
    const url: string = `${this.apiUrl}me/playlists`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error Get Current Users Playlists:', error);
        return throwError(
          () => new Error('Failed to Get Current Users Playlists')
        );
      })
    );
  }

  public createPlaylist(userId: string, playlistNr: number): Observable<any> {
    const url = `${this.apiUrl}users/${userId}/playlists`;
    const body = {
      name: `My Playlist #${playlistNr}`,
      description: 'New playlist description',
      public: true,
    };
    return this.http.post(url, body).pipe(
      catchError((error) => {
        console.error('Error create playlist:', error);
        return throwError(() => new Error('Failed to create playlist'));
      })
    );
  }

  public changePlaylistDetails(details: DialogChangePlaylistDetailsData): Observable<any> {
    const url = `${this.apiUrl}playlists/${details.id}`;
    const body = {
      name: details.name,
      description: details.description,
      public: true,
    };
    return this.http.put(url, body).pipe(
      catchError((error) => {
        console.error('Error updating playlist:', error);
        return throwError(() => new Error('Failed to update playlist'));
      })
    );
  }

  public getApiData(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error Get Api Data:', error);
        return throwError(() => new Error('Failed to Get Api Data'));
      })
    );
  }

  // --- Tracks ---
  public getUsersSavedTracks(): Observable<any> {
    const url: string = `${this.apiUrl}me/tracks`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error Get Users Saved Tracks:', error);
        return throwError(() => new Error('Failed to Get Users Saved Tracks'));
      })
    );
  }

  public saveTracksForCurrentUser(trackId: string): Observable<any> {
    const url = `${this.apiUrl}me/tracks?ids=${trackId}`;
    const body = {
      ids: [trackId],
    };
    return this.http.put(url, body).pipe(
      catchError((error) => {
        console.error(`Error Save Tracks for Current User:`, error);
        return throwError(
          () => new Error(`Failed to Save Tracks for Current User`)
        );
      })
    );
  }

  public removeUsersSavedTracks(trackId: string): Observable<any> {
    const url = `${this.apiUrl}me/tracks?ids=${trackId}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error(`Error Remove User's Saved Tracks:`, error);
        return throwError(
          () => new Error(`Failed to Remove User's Saved Tracks`)
        );
      })
    );
  }

  public checkUsersSavedTracks(trackIds: string[]): Observable<any> {
    const url: string = `${this.apiUrl}me/tracks/contains?ids=${trackIds.join(
      ','
    )}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error check users saved tracks:`, error);
        return throwError(
          () => new Error(`Failed to check users saved tracks`)
        );
      })
    );
  }
  
  private getTrackPreviewUrl(trackId: string): Observable<any> {
    const url = `${this.previewFetcherBaseUrl}?trackId=${trackId}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error Get Preview Url for Track (trackId:${trackId}):`, error);
        return throwError(() => new Error(`Failed to Get Preview Url for Track (trackId:${trackId})`));
      })
    );
  }

  private async fetchPreviewUrlForTrack(trackId: string): Promise<string | null> {
    try {
      const response = await lastValueFrom(this.getTrackPreviewUrl(trackId));
      return response.url;
    } catch (error) {
      console.error(`Failed to fetch preview URL for trackId: ${trackId}`, error);
      return null;
    }
  }

  public async loadPreviewUrlIfMissing(track: TrackFile): Promise<void> {
    if (!track.previewUrl) {
      try {
        const previewUrl = await this.fetchPreviewUrlForTrack(track.id);
        if (previewUrl) {
          track.previewUrl = previewUrl;
        }
      } catch (error) {
        console.error(`Error loading preview URL for trackId: ${track.id}`, error);
      }
    }
  }

  // ---Artists ---
  public getArtist(artistIds: string[]): Observable<any> {
    const url: string = `${this.apiUrl}artists?ids=${artistIds.join(',')}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error Get Artist:`, error);
        return throwError(() => new Error(`Failed to Get Artist`));
      })
    );
  }

  public getArtistAlbums(artistId: string): Observable<any> {
    const url: string = `${this.apiUrl}artists/${artistId}/albums`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error Get Artist's Albums:`, error);
        return throwError(() => new Error(`Failed to Get Artist's Albums`));
      })
    );
  }

  public getArtistTopTracks(artistId: string): Observable<any> {
    const url: string = `${this.apiUrl}artists/${artistId}/top-tracks`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`Error Get Artist's Topt Tracks:`, error);
        return throwError(() => new Error(`Failed to Get Artist's Top Tracks`));
      })
    );
  }

  // --- Categories ---
  public getSeveralBrowseCategories(): Observable<any> {
    const url = `${this.apiUrl}browse/categories`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error Get Several Browse Categories:', error);
        return throwError(
          () => new Error('Failed to Get Several Browse Categories')
        );
      })
    );
  }

  // --- Search ---
  public searchForItem(searchQuery: string, type: string): Observable<any> {
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `${this.apiUrl}search?q=${encodedQuery}&type=${type}&limit=10`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error search for item:', error);
        return throwError(() => new Error('Failed to search for item'));
      })
    );
  }
}
