import { Component, inject, Input, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { LikeButtonComponent } from '../buttons/like-button/like-button.component';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { TrackNumberComponent } from './track-number/track-number.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemoveTrackComponent } from '../dialog/dialog-remove-track/dialog-remove-track.component';
import { CustomButtonComponent } from '../buttons/custom-button/custom-button.component';
import { DialogAddTrackComponent } from '../dialog/dialog-add-track/dialog-add-track.component';
import { Playlist, Track } from '../../models';
import { DomManipulationService, LikedTracksService, NavigationService } from '../../services';

@Component({
  selector: 'app-track-list',
  imports: [
    CommonModule,
    MatMenuModule,
    LikeButtonComponent,
    ResizeObserverDirective,
    TrackNumberComponent,
    CustomButtonComponent,
  ],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.scss',
})
export class TrackListComponent {
  private likedTracksService = inject(LikedTracksService);
  private domService = inject(DomManipulationService);
  private navigationService = inject(NavigationService);
  private dialog = inject(MatDialog);

  @Input() track!: Track;
  @Input() trackIndex!: number;
  @Input() playlist!: Playlist;
  @Input() isPlaying!: boolean;
  @Input() state!: StreamState;
  @Input() playingTrack!: Track | null;
  @Input() showDeleteBtn!: boolean;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  public contextMenuPosition = { x: '0px', y: '0px' };
  public isHovered = false;
  private readonly widthTrackNumber = 22;
  private readonly widthImg = 55;
  private readonly widthBtn = 65;
  private readonly widthLength = 40;
  private readonly margin = 15;

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

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu.menu) {
      this.contextMenu.menu.focusFirstItem('mouse');
    }
    this.contextMenu.openMenu();
  }

  public openRemoveDialog(): void {
    const dialogRef = this.dialog.open(DialogRemoveTrackComponent, {
      data: {
        playlistId: this.playlist!.id,
        snapshot_id: this.playlist!.snapshotId,
        uri: this.track.uri,
        trackId: this.track.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  public openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddTrackComponent, {
      data: {
        position: 0,
        uri: this.track.uri,
        track: this.track,
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  public isTrackLiked(trackId: string): Signal<boolean> {
    return this.likedTracksService.isLiked(trackId);
  }

  public navigateToArtist(id: string): void {
    this.navigationService.artist(id);
  }
}
