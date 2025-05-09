import { Component, inject, Input } from '@angular/core';
import { StreamState } from '../../../models/stream-state.model';
import { SoundwaveComponent } from '../../soundwave/soundwave.component';
import { CommonModule } from '@angular/common';
import { Playlist, Track } from '../../../models';
import { AudioService } from '../../../services';

@Component({
  selector: 'app-track-number',
  imports: [CommonModule, SoundwaveComponent],
  templateUrl: './track-number.component.html',
  styleUrl: './track-number.component.scss',
})
export class TrackNumberComponent {
  private audioService = inject(AudioService);

  @Input() state!: StreamState;
  @Input() trackIndex!: number;
  @Input() playlist!: Playlist;
  @Input() track!: Track;
  @Input() playingTrack!: Track | null;
  @Input() isHovered: boolean = false;

  public async onPlayPauseClicked(): Promise<void> {
    await this.audioService.prepareAndPlayTrack(
      this.playlist,
      this.track
    );
  }
}
