import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DialogChangePlaylistDetailsData, DialogRemoveTrackData } from '../models/dialog.model';
import { environment } from '../../environments/environment';
import {
  SpotifyArtistDto,
  SpotifyPlaylistDto,
  SpotifyTrackDto,
  SpotifyUserDto,
  SpotifyUserPlaylistsDto,
  SpotifyUserSavedTracksDto
} from '../dto';
import { AlbumMapper, ArtistMapper, PlaylistMapper, TrackMapper, UserMapper } from '../mappers';
import { Album, Artist, Playlist, Track, User } from '../models';
import { SpotifyAlbumDto, SpotifyArtistAlbumsDto } from '../dto/spotify-album.dto';
import { SpotifySearchedResultDto } from '../dto/spotify-search-results.dto';
import { SpotifyPlaylistTracksDto } from '../dto/spotify-track.dto';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private http = inject(HttpClient);
  private readonly apiUrl: string = 'https://api.spotify.com/v1/';
  private readonly previewFetcherBaseUrl: string = environment.previewFetchUrl;

  // --- Users ---
  public getCurrentUser(): Observable<User> {
    return this.fetchCurrentUser(UserMapper.toModel);
  }

  public getCurrentUserAsJson(): Observable<User> {
    return this.fetchCurrentUser(UserMapper.toJSON);
  }

  private fetchCurrentUser<T>(transform: (dto: SpotifyUserDto) => T): Observable<T> {
    const url = `${this.apiUrl}me`;
    return this.http.get<SpotifyUserDto>(url).pipe(
      map(transform),
      catchError((error) => {
        console.error('Error Get Current Users Profile:', error);
        return throwError(() => new Error('Failed to Get Current Users Profile'));
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
  ): Observable<boolean> {
    const url: string = `${this.apiUrl}playlists/${playlistId}/followers/contains`;
    return this.http.get<boolean[]>(url).pipe(
      map(arr => arr[0]),
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
  ): Observable<boolean[]> {
    const url: string = `${this.apiUrl}me/following/contains?type=${type}&ids=${ids.join(',')}`;
    return this.http.get<boolean[]>(url).pipe(
      catchError((error) => {
        console.error(`Error Check if Current User Follows Artists or Users:`, error);
        return throwError(
          () => new Error(`Failed to Check if Current User Follows Artists or Users`)
        );
      })
    );
  }

  // --- Playlists ---
  public getPlaylist(playlistId: string): Observable<Playlist> {
    const url: string = `${this.apiUrl}playlists/${playlistId}`;
    return this.http.get<SpotifyPlaylistDto>(url).pipe(
      map(playlistDto => PlaylistMapper.toModel(playlistDto)),
      catchError((error) => {
        console.error(`Error Get Playlist (playlistId:${playlistId}):`, error);
        return throwError(
          () => new Error(`Failed to Get Playlist (playlistId:${playlistId})`)
        );
      })
    );
  }

  public getPlaylistSnapshotId(playlistId: string): Observable<string> {
    return this.getPlaylist(playlistId).pipe(
      map(playlist => playlist.snapshotId)
    );
  }

  getPlaylistTracks(playlistId: string): Observable<Track[]> {
    const url: string = `${this.apiUrl}playlists/${playlistId}/tracks`;
    return this.http.get<SpotifyPlaylistTracksDto>(url).pipe(
      map((response: SpotifyPlaylistTracksDto) => {
        return response.items.map((item, index) => {
          return TrackMapper.toModel(item.track, index);
        });
      }),
      catchError((error) => {
        console.error(`Error Get Playlist Tracks (playlistId:${playlistId}):`, error);
        return throwError(
          () => new Error(`Failed to Get Playlist Tracks (playlistId:${playlistId})`)
        );
      })
    );
  }

  public addItemsToPlaylist(
    playlistId: string,
    data: { uri: string, position: number }
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

  public getUsersPlaylists(): Observable<Playlist[]> {
    const url: string = `${this.apiUrl}me/playlists`;
    return this.http.get<SpotifyUserPlaylistsDto>(url).pipe(
      map((userPlaylistsDto) => userPlaylistsDto.items.map(PlaylistMapper.toModel)),
      catchError((error) => {
        console.error('Error Get Current Users Playlists:', error);
        return throwError(
          () => new Error('Failed to Get Current Users Playlists')
        );
      })
    );
  }

  public createPlaylist(userId: string, playlistNr: number): Observable<Playlist> {
    const url = `${this.apiUrl}users/${userId}/playlists`;
    const body = {
      name: `My Playlist #${playlistNr}`,
      description: 'New playlist description',
      public: true,
    };
    return this.http.post<SpotifyPlaylistDto>(url, body).pipe(
      map(playlistDto => PlaylistMapper.toModel(playlistDto)),
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

  // --- Tracks ---
  public getUsersSavedTracks(): Observable<Track[]> {
    const url: string = `${this.apiUrl}me/tracks`;
    return this.http.get<SpotifyUserSavedTracksDto>(url).pipe(
      map(userSavedTracksDto => userSavedTracksDto.items.map((item, index) => TrackMapper.toModel(item.track, index))),
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

  public checkUsersSavedTracks(trackIds: string[]): Observable<boolean[]> {
    const url: string = `${this.apiUrl}me/tracks/contains?ids=${trackIds.join(
      ','
    )}`;
    return this.http.get<boolean[]>(url).pipe(
      catchError((error) => {
        console.error(`Error check users saved tracks:`, error);
        return throwError(
          () => new Error(`Failed to check users saved tracks`)
        );
      })
    );
  }

  public getTrackPreviewUrl(id: string): Observable<string> {
    const url = `${this.previewFetcherBaseUrl}?trackId=${id}`;
    return this.http.get<{ url: string }>(url).pipe(
      map((response) => response.url),
      catchError((error) => {
        console.error(`Error Get Preview Url for Track (trackId:${id}):`, error);
        return throwError(() => new Error(`Failed to Get Preview Url for Track (trackId:${id})`));
      })
    );
  }

  // ---Artists ---
  public getArtist(artistIds: string[]): Observable<Artist[]> {
    const url: string = `${this.apiUrl}artists?ids=${artistIds.join(',')}`;
    return this.http.get<{ artists: SpotifyArtistDto[] }>(url).pipe(
      map(response => response.artists.map(ArtistMapper.toModel)),
      catchError((error) => {
        console.error(`Error Get Artist:`, error);
        return throwError(() => new Error(`Failed to Get Artist`));
      })
    );
  }

  public getArtistAlbums(artistId: string): Observable<Album[]> {
    const url: string = `${this.apiUrl}artists/${artistId}/albums`;
    return this.http.get<SpotifyArtistAlbumsDto>(url).pipe(
      map(artistAlbumsDto => artistAlbumsDto.items.map(AlbumMapper.toModel)),
      catchError((error) => {
        console.error(`Error Get Artist's Albums:`, error);
        return throwError(() => new Error(`Failed to Get Artist's Albums`));
      })
    );
  }

  public getArtistTopTracks(artistId: string): Observable<Track[]> {
    const url: string = `${this.apiUrl}artists/${artistId}/top-tracks`;
    return this.http.get<SpotifyTrackDto[]>(url).pipe(
      map(trackDtos => trackDtos.map((trackDto: SpotifyTrackDto, index: number) => TrackMapper.toModel(trackDto, index))),
      catchError((error) => {
        console.error(`Error Get Artist's Topt Tracks:`, error);
        return throwError(() => new Error(`Failed to Get Artist's Top Tracks`));
      })
    );
  }

  public searchByType<T>(query: string, type: string): Observable<T[]> {
    if (query.length === 0) { return new Observable<T[]>(observer => observer.next([])); }
    const endpoint = `search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`;
    const url = `${this.apiUrl}${endpoint}`;

    return this.http.get<SpotifySearchedResultDto<T>>(url).pipe(
      map(response => {
        const resultSection = (response as any)[type + 's'];
        const items = resultSection?.items ?? [];
        let mappedItems: T[] = [];
        if (type === 'playlist') {
          mappedItems = items.filter(Boolean).map((item: SpotifyPlaylistDto) => PlaylistMapper.toModel(item));
        } else if (type === 'track') {
          mappedItems = items.filter(Boolean).map((item: SpotifyTrackDto, index: number) => TrackMapper.toModel(item, index));
        } else if (type === 'album') {
          mappedItems = items.filter(Boolean).map((item: SpotifyAlbumDto) => AlbumMapper.toModel(item));
        } else if (type === 'artist') {
          mappedItems = items.filter(Boolean).map((item: SpotifyArtistDto) => ArtistMapper.toModel(item));
        } else if (type === 'show') {
          mappedItems = items.filter(Boolean).map((item: any) => item); // Adjust here if Show DTO is available
        } else if (type === 'episode') {
          mappedItems = items.filter(Boolean).map((item: any) => item); // Adjust here if Episode DTO is available
        } else if (type === 'audiobook') {
          mappedItems = items.filter(Boolean).map((item: any) => item); // Adjust here if Audiobook DTO is available
        }

        return mappedItems.filter(Boolean);
      }),
      catchError(error => {
        console.error('Error Search:', error);
        return throwError(() => new Error('Failed to Search'));
      })
    );
  }
}
