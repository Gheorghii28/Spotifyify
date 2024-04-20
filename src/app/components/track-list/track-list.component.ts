import { Component, Input, OnInit } from '@angular/core';
import { Track } from '../../models/spotify.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
})
export class TrackListComponent implements OnInit {
  @Input() data!: any;
  @Input() trackNr!: number;
  trackData!: Track;

  constructor() {}

  ngOnInit(): void {
    this.trackData = this.data.track;
  }
}
