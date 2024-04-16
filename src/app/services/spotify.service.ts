import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private tokenService: TokenService) {}

  async fetchWebApi(endpoint: any, method: any) {
    const token = this.tokenService.getAccessToken();
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
    });
    return await res.json();
  }

  async getTopTracks() {
    return (await this.fetchWebApi('v1/me/top/tracks', 'GET')).items;
  }
}
