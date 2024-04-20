import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Playlist } from '../../models/spotify.model';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [ViewHeaderComponent, TrackListComponent, CommonModule],
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
