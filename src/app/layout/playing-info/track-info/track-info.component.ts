import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../../models';

@Component({
  selector: 'app-track-info',
  imports: [CommonModule],
  templateUrl: './track-info.component.html',
  styleUrl: './track-info.component.scss',
})
export class TrackInfoComponent {
  @Input() track!: Track;
}
