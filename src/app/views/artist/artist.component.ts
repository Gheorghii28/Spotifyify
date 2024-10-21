import { Component, OnInit } from '@angular/core';
import { ArtistHeaderComponent } from './artist-header/artist-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlatformDetectionService } from '../../services/platform-detection.service';
import { Artist } from '../../models/spotify.model';
import { lastValueFrom } from 'rxjs';
import { SpotifyService } from '../../services/spotify.service';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { PageInProgressComponent } from '../../components/page-in-progress/page-in-progress.component';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [
    ArtistHeaderComponent,
    PageInProgressComponent,
    CommonModule,
    ResizeObserverDirective,
  ],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss'
})
export class ArtistComponent implements OnInit {
  artist!: Artist;
  
  constructor(
    private route: ActivatedRoute,
    private platformDetectionService: PlatformDetectionService,
    private spotifyService: SpotifyService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const artistId = params['id'];
      if (this.platformDetectionService.isBrowser) {
        const artistIds: string[] = [artistId];
        const artistResults = await lastValueFrom(
          this.spotifyService.getArtist(artistIds)
        );
        this.artist = artistResults.artists[0];
        const albums = await lastValueFrom(
          this.spotifyService.getArtistAlbums(artistId)
        );
        const topTracks = await lastValueFrom(
          this.spotifyService.getArtistAlbums(artistId)
        );
      }
    });
  }
}
