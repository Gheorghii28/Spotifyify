import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Playlist } from '../../models/spotify.model';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {
  playlistData!: Playlist;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const playlistId = params['id'];
      this.fetchAndStorePlaylistData(playlistId);
    });
  }

  async fetchAndStorePlaylistData(id: string): Promise<void> {
    try {
      this.playlistData = await this.spotifyService.getSpotifyData(
        `playlists/${id}`
      );
      console.log('PlaylistData:', this.playlistData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
