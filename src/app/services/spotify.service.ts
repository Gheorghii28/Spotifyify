import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  DialogAddTrackData,
  DialogRemoveTrackData,
} from '../models/dialog.model';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private readonly apiUrl: string = 'https://api.spotify.com/v1/';

  constructor(private tokenService: TokenService, private http: HttpClient) {}

  private get getHeaders(): HttpHeaders {
    const token = this.tokenService.getAccessToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return headers;
  }

  // --- Users ---
  public getCurrentUsersProfile(): Observable<any> {
    const url = `${this.apiUrl}me`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.put(url, body, options).pipe(
      catchError((error) => {
        console.error(`Error follow playlist:`, error);
        return throwError(() => new Error(`Failed to follow playlist`));
      })
    );
  }

  public unfollowPlaylist(playlistId: string): Observable<any> {
    const url = `${this.apiUrl}playlists/${playlistId}/followers`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.delete(url, options).pipe(
      catchError((error) => {
        console.error(`Error unfollow playlist:`, error);
        return throwError(() => new Error(`Failed to unfollow playlist`));
      })
    );
  }

  public checkIfCurrentUserFollowsPlaylist(
    playlistId: string
  ): Observable<any> {
    const url: string = `${this.apiUrl}playlists/${playlistId}/followers/contains`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
      catchError((error) => {
        console.error(`Error Check if Current User Follows Playlist:`, error);
        return throwError(
          () => new Error(`Failed to Check if Current User Follows Playlist`)
        );
      })
    );
  }

  // --- Playlists ---
  public getPlaylist(playlistId: string): Observable<any> {
    const url: string = `${this.apiUrl}playlists/${playlistId}`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.post(url, body, options).pipe(
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
      headers: this.getHeaders,
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.post(url, body, options).pipe(
      catchError((error) => {
        console.error('Error create playlist:', error);
        return throwError(() => new Error('Failed to create playlist'));
      })
    );
  }

  public getApiData(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}${endpoint}`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
      catchError((error) => {
        console.error('Error Get Api Data:', error);
        return throwError(() => new Error('Failed to Get Api Data'));
      })
    );
  }

  // --- Tracks ---
  public getUsersSavedTracks(): Observable<any> {
    const url: string = `${this.apiUrl}me/tracks`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.put(url, body, options).pipe(
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.delete(url, options).pipe(
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
      catchError((error) => {
        console.error(`Error check users saved tracks:`, error);
        return throwError(
          () => new Error(`Failed to check users saved tracks`)
        );
      })
    );
  }

  // ---Artists ---
  public getArtist(artistIds: string[]): Observable<any> {
    const url: string = `${this.apiUrl}artists?ids=${artistIds.join(',')}`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
      catchError((error) => {
        console.error(`Error Get Artist:`, error);
        return throwError(() => new Error(`Failed to Get Artist`));
      })
    );
  }

  // --- Categories ---
  public getSeveralBrowseCategories(): Observable<any> {
    const url = `${this.apiUrl}browse/categories`;
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
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
    const options = {
      headers: this.getHeaders,
    };
    return this.http.get(url, options).pipe(
      catchError((error) => {
        console.error('Error search for item:', error);
        return throwError(() => new Error('Failed to search for item'));
      })
    );
  }
}
