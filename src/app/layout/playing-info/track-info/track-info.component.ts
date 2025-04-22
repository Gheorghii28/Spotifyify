import { Component, Input } from '@angular/core';
import { TrackFile } from '../../../models/cloud.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-info.component.html',
  styleUrl: './track-info.component.scss',
})
export class TrackInfoComponent {
  @Input() track!: TrackFile;
}
