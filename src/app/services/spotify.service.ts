import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { PlaylistsObject } from '../models/spotify.model';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private tokenService: TokenService) {}

  async fetchWebApi(
    endpoint: string,
    method: string,
    responseType: 'json' | 'text'
  ) {
    const token = this.tokenService.getAccessToken();
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
    });
    if (responseType === 'json') {
      return await res.json();
    } else {
      return await res.text();
    }
  }

  public async postToSpotify(endpoint: string, body:any): Promise<any> {
    const token = this.tokenService.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
  
    if (response.ok) {
      return await response.json();
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  }

  async getSpotifyData(endpoint: string) {
    return await this.fetchWebApi(`v1/${endpoint}`, 'GET', 'json');
  }

  async updateSpotifyData(endpoint: string) {
    return await this.fetchWebApi(`v1/${endpoint}`, 'PUT', 'text');
  }

  async removeSpotifyData(endpoint: string) {
    return await this.fetchWebApi(`v1/${endpoint}`, 'DELETE', 'text');
  }

  async fetchLikedStatusForTrack(id: string) {
    const likedStatusArr = await this.getSpotifyData(
      `me/tracks/contains?ids=${id}`
    );
    return likedStatusArr[0];
  }

  public async fetchMyPlaylists(): Promise<PlaylistsObject> {
    const response = await this.getSpotifyData(`me/playlists`);
    return response;
  }  
}
