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
}
