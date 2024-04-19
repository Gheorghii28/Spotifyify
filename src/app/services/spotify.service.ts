import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private tokenService: TokenService) {}

  async fetchWebApi(endpoint: string, method: string) {
    const token = this.tokenService.getAccessToken();
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
    });
    return await res.json();
  }

  async getSpotifyData(endpoint:string) {
    return (
      await this.fetchWebApi(
        `v1/${endpoint}`,
        'GET'
      )
    );
  }
}
