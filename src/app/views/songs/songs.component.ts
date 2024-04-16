import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.scss',
})
export class SongsComponent {
  constructor(private spotifyService: SpotifyService) {
    this.loadTopTracks();
  }

  async loadTopTracks() {
    try {
      const topTracks = await this.spotifyService.getTopTracks();
      console.log('Top Tracks:', topTracks);
      if (topTracks && topTracks.length > 0) {
        const formattedTracks = topTracks.map(
          ({ name, artists }: { name: any; artists: any }) =>
            `${name} von ${artists
              .map((artist: any) => artist.name)
              .join(', ')}`
        );
        console.log('formattedTracks:', formattedTracks);
      } else {
        console.log('Keine Top-Tracks gefunden.');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Top-Tracks:', error);
    }
  }
}
