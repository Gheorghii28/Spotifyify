import { Component, Input } from '@angular/core';
import { Playlist } from '../../models/spotify.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './view-header.component.html',
  styleUrl: './view-header.component.scss',
})
export class ViewHeaderComponent {
  @Input() data!: Playlist;
}
