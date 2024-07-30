import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { AudioService } from '../../services/audio.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { LikeButtonComponent } from '../buttons/like-button/like-button.component';
import { DomManipulationService } from '../../services/dom-manipulation.service';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { TrackNumberComponent } from './track-number/track-number.component';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [
    CommonModule,
    LikeButtonComponent,
    ResizeObserverDirective,
    TrackNumberComponent,
  ],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
})
export class TrackListComponent {
  @Input() track!: TrackFile;
  @Input() trackIndex!: number;
  @Input() files!: CloudFiles;
  @Input() state!: StreamState;
  @Input() playingTrack!: TrackFile;
  public isHovered = false;
  private readonly widthTrackNumber = 22;
  private readonly widthImg = 55;
  private readonly widthBtn = 65;
  private readonly widthLength = 40;
  private readonly margin = 15;

  constructor(
    public audioService: AudioService,
    private domService: DomManipulationService
  ) {}

  public onResize(event: ResizeObserverEntry): void {
    const width = event.contentRect.width;
    const widthTitle = this.calculateWidthTitle(width);
    this.updateTitleWidth(widthTitle);
  }

  private updateTitleWidth(widthTitle: number): void {
    this.domService.applyStylesToElementByClass(
      'track-title',
      'width',
      `${widthTitle}px`
    );
  }

  private calculateWidthTitle(widthHost: number): number {
    return (
      widthHost -
      this.widthTrackNumber -
      this.widthImg -
      this.widthBtn -
      this.widthLength -
      this.margin
    );
  }

  public onMouseEnter(): void {
    this.isHovered = true;
  }

  public onMouseLeave(): void {
    this.isHovered = false;
  }
}
