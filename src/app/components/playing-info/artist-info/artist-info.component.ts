import { Component, Input } from '@angular/core';
import { Artist } from '../../../models/spotify.model';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-artist-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-info.component.html',
  styleUrl: './artist-info.component.scss',
})
export class ArtistInfoComponent {
  @Input() artist!: Artist;
  description: string =
    'text Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti, nihil. Error explicabo, saepe dolorem sapiente odit, natus at aspernatur impedit repellat minima similique. Tempora sint repellat a possimus, nobis atque?';

  constructor(public utilsService: UtilsService) {}

  public getArtistImageUrl(artist: Artist): string {
    return artist.images[0]?.url || '';
  }
}
