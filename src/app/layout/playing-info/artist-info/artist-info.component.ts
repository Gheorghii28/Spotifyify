import { Component, Input } from '@angular/core';
import { Artist } from '../../../models/spotify.model';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../services/utils.service';
import { SpotifyService } from '../../../services/spotify.service';
import { lastValueFrom } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-artist-info',
  imports: [CommonModule],
  templateUrl: './artist-info.component.html',
  styleUrl: './artist-info.component.scss',
})
export class ArtistInfoComponent {
  @Input() artist!: Artist;
  isFollowing!: boolean;
  description: string =
    'text Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti, nihil. Error explicabo, saepe dolorem sapiente odit, natus at aspernatur impedit repellat minima similique. Tempora sint repellat a possimus, nobis atque?';

  constructor(
    public utilsService: UtilsService,
    private spotifyService: SpotifyService,
    public navigationService: NavigationService
  ) {}

  public getArtistImageUrl(artist: Artist): string {
    return artist.images[0]?.url || '';
  }

  public navigateToArtist(id: string): void {
    this.navigationService.artist(id);
  }

  public async toggleFollowing(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const isFollow = await lastValueFrom(
      this.spotifyService.checkIfCurrentUserFollowsArtistsorUsers([this.artist.id], 'artist')
    );
    this.isFollowing = isFollow[0];
    if(this.isFollowing) {
      await lastValueFrom(this.spotifyService.unfollowArtistsorUsers([this.artist.id], 'artist'));
    } else {
      await lastValueFrom(this.spotifyService.followArtistsorUsers([this.artist.id], 'artist'));
    }
  }
}
