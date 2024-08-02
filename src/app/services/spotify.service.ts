import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private tokenService: TokenService) {}

  async fetchWebApi(
    endpoint: string,
    method: string,
    responseType: 'json' | 'text',
    body: any = undefined
  ) {
    const token = this.tokenService.getAccessToken();
    const options: RequestInit = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
    };
    if (body) {
      const bodyAsStringify = JSON.stringify(body);
      options.body = bodyAsStringify;
    }
    const res = await fetch(`https://api.spotify.com/${endpoint}`, options);
    if (responseType === 'json') {
      return await res.json();
    } else {
      return await res.text();
    }
  }

  public async postToSpotify(endpoint: string, body: any): Promise<any> {
    const token = this.tokenService.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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

  async updateSpotifyData(endpoint: string, body: any = undefined) {
    return await this.fetchWebApi(`v1/${endpoint}`, 'PUT', 'text', body);
  }

  async removeSpotifyData(endpoint: string, body: any = undefined) {
    return await this.fetchWebApi(`v1/${endpoint}`, 'DELETE', 'text', body);
  }

  async fetchLikedStatusForTrack(id: string) {
    const likedStatusArr = await this.getSpotifyData(
      `me/tracks/contains?ids=${id}`
    );
    return likedStatusArr[0];
  }

  public async retrieveSpotifyData<T>(endpoint: string): Promise<T> {
    const response = await this.getSpotifyData(endpoint);
    return response;
  }

  public async getPlaylistFollowStatus(id: string): Promise<boolean> {
    if (id.length > 0) {
      const isFollowing = await this.checkIfCurrentUserFollowsPlaylist(id);
      return isFollowing;
    }
    return false;
  }

  private async checkIfCurrentUserFollowsPlaylist(
    id: string
  ): Promise<boolean> {
    const response: boolean[] = await this.getSpotifyData(
      `playlists/${id}/followers/contains`
    );
    return response[0];
  }
}
