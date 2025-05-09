import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../../models';

@Component({
  selector: 'app-artist-header',
  imports: [CommonModule],
  templateUrl: './artist-header.component.html',
  styleUrl: './artist-header.component.scss'
})
export class ArtistHeaderComponent {
  @Input() artist!: Artist;
}
