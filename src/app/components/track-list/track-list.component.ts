import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamState } from '../../models/stream-state.model';
import { AudioService } from '../../services/audio.service';
import { CloudFiles, TrackFile } from '../../models/cloud.model';
import { LikeButtonComponent } from '../buttons/like-button/like-button.component';
import { DomManipulationService } from '../../services/dom-manipulation.service';
import { ResizeObserverDirective } from '../../directives/resize-observer.directive';
import { TrackNumberComponent } from './track-number/track-number.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemoveTrackComponent } from '../dialog/dialog-remove-track/dialog-remove-track.component';
import { CustomButtonComponent } from '../buttons/custom-button/custom-button.component';
import { CloudService } from '../../services/cloud.service';
import { DialogAddTrackComponent } from '../dialog/dialog-add-track/dialog-add-track.component';
import { PlaylistsObject } from '../../models/spotify.model';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-track-list',
  standalone: true,
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
  @Input() track!: TrackFile;
  @Input() trackIndex!: number;
  @Input() files!: CloudFiles;
  @Input() state!: StreamState;
  @Input() playingTrack!: TrackFile;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  public contextMenuPosition = { x: '0px', y: '0px' };
  public isHovered = false;
  private readonly widthTrackNumber = 22;
  private readonly widthImg = 55;
  private readonly widthBtn = 65;
  private readonly widthLength = 40;
  private readonly margin = 15;

  constructor(
    public audioService: AudioService,
    private domService: DomManipulationService,
    private dialog: MatDialog,
    private cloudService: CloudService,
    private spotifyService: SpotifyService
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
        playlistId: this.files.id,
        snapshot_id: this.files.snapshot_id,
        uri: this.track.uri,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTrackFromPlaylist();
      }
    });
  }

  private async deleteTrackFromPlaylist(): Promise<void> {
    const trackIndex = this.files.tracks.findIndex(
      (track) => track.id === this.track.id
    );
    if (trackIndex !== -1) {
      this.files.tracks.splice(trackIndex, 1);
      this.cloudService.setFiles(this.files);
      const playlists: PlaylistsObject =
        await this.spotifyService.retrieveSpotifyData(`me/playlists`);
      this.cloudService.setMyPlaylists(playlists);
    }
  }

  public openAddDialog(): void {
    const dialogRef = this.dialog.open(DialogAddTrackComponent, {
      data: {
        position: 0,
        uri: this.track.uri,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addTrackToPlaylist();
      }
    });
  }

  private async addTrackToPlaylist(): Promise<void> {
    const playlists: PlaylistsObject =
      await this.spotifyService.retrieveSpotifyData(`me/playlists`);
    this.cloudService.setMyPlaylists(playlists);
  }
}
