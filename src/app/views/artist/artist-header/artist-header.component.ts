import { Component, Input } from '@angular/core';
import { Artist } from '../../../models/spotify.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-header.component.html',
  styleUrl: './artist-header.component.scss'
})
export class ArtistHeaderComponent {
  @Input() data!: Artist;
}
