import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistQueryService {

  constructor() { }

  private playlistSearchQueries: string[] = [
    'chill summer',
    'lofi beats',
    'happy vibes',
    'smooth jazz',
    'relaxing music',
    'study music',
    'indie pop',
    'tropical house',
    'deep house',
    'ambient music',
    'energetic beats',
    'lofi hip hop',
    'summer vibes',
    'acoustic chill',
    'electronic music',
    'pop hits',
    'workout music',
    'focus music',
    'romantic playlists',
    'classical music'
  ];

  getQueries(): string[] {
    return this.playlistSearchQueries;
  }
}
