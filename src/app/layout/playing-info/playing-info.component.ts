import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';
import { TrackFile } from '../../models/cloud.model';
import { Artist, Playlist } from '../../models/spotify.model';
import { HeaderPlayingInfoComponent } from './header-playing-info/header-playing-info.component';
import { TrackInfoComponent } from './track-info/track-info.component';
import { ArtistInfoComponent } from './artist-info/artist-info.component';

@Component({
  selector: 'app-playing-info',
  standalone: true,
  imports: [
    CommonModule,
    CustomScrollbarDirective,
    HeaderPlayingInfoComponent,
    TrackInfoComponent,
    ArtistInfoComponent,
  ],
  templateUrl: './playing-info.component.html',
  styleUrl: './playing-info.component.scss',
})
export class PlayingInfoComponent {
  @Input() playingTrack!: TrackFile;
  @Input() playlist!: Playlist;
  @Input() artists!: Artist[];

  constructor(
    public audioService: AudioService,
  ) {}
}
