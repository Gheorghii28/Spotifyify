import { Component, effect, EffectRef, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { BtnPlayComponent } from '../../components/buttons/btn-play/btn-play.component';
import { BtnFollowComponent } from '../../components/buttons/btn-follow/btn-follow.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CustomButtonComponent } from '../../components/buttons/custom-button/custom-button.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogRemovePlaylistComponent } from '../../components/dialog/dialog-remove-playlist/dialog-remove-playlist.component';
import { DialogChangePlaylistDetailsComponent } from '../../components/dialog/dialog-change-playlist-details/dialog-change-playlist-details.component';
import { DialogChangePlaylistDetailsData } from '../../models/dialog.model';
import { Playlist, Track } from '../../models';
import { AudioService, LayoutService, ScrollService, UserService, UtilsService } from '../../services';
import { PlaylistManagerService } from '../../layout/services/playlist-manager.service';
import { StreamState } from '../../models/stream-state.model';
import { PlaylistStore } from '../../store/playlist.store';
import { SkeletonComponent } from '../../components/skeleton/skeleton.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-playlist',
  imports: [
    ViewHeaderComponent,
    TrackListComponent,
    CommonModule,
    TrackListHeaderComponent,
    BtnPlayComponent,
    BtnFollowComponent,
    MatButtonModule,
    MatMenuModule,
    CustomButtonComponent,
    SkeletonComponent,
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {

  private audioService = inject(AudioService);
  private playlistManager = inject(PlaylistManagerService);
  private userService = inject(UserService);
  private utilsService = inject(UtilsService);
  private scrollService = inject(ScrollService);
  private layoutService = inject(LayoutService);
  private snackbar = inject(SnackbarService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private store = inject(PlaylistStore);

  private destroyEffect!: EffectRef;
  private currentIndex: number = 0;
  displayedTracks: Track[] = [];

  constructor() {
    this.destroyEffect = effect(() => {
      const scrollEvent = this.scrollService.scroll();
      if (scrollEvent) {
        this.utilsService.handleScroll(
          scrollEvent,
          () => this.loadMoreTracks()
        );
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const id = params['id'];
      if (id) {
        await this.store.loadPlaylist(id);
        this.resetTrackView();
        this.loadMoreTracks();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyEffect.destroy();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.loadMoreTracks();
  }

  private loadMoreTracks(): void {
    const newTracks = this.playlist.tracks.slice(
      this.currentIndex,
      this.currentIndex + this.visibleTracks
    );
    this.displayedTracks = [...this.displayedTracks, ...newTracks];
    this.currentIndex += this.visibleTracks;
  }

  private resetTrackView(): void {
    this.currentIndex = 0;
    this.displayedTracks = [];
  }

  public openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DialogRemovePlaylistComponent, {
      data: { name: this.playlist.name, id: this.playlist.id },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  public openChangeDialog(): void {
    const dialogRef = this.dialog.open(DialogChangePlaylistDetailsComponent, {
      data: {
        id: this.playlist.id,
        name: this.playlist.name,
        description: this.playlist.description
      },
    });

    dialogRef.afterClosed().subscribe(async (result: DialogChangePlaylistDetailsData) => {
      if (result) {
        await this.snackbar.runWithSnackbar(
          this.playlistManager.changePlaylistDetails(result),
          'Playlist updated successfully!'
        );
        this.store.updateCachedPlaylist(result.id, {
          name: result.name,
          description: result.description,
        });
      }
    });
  }

  public get playingTrack(): Track {
    return this.audioService.playingTrack()!;
  }

  public get state(): StreamState {
    return this.audioService.state()!;
  }

  public get playlist(): Playlist {
    return this.store.playlist()!;
  }

  public get isUserCreated(): boolean {
    return this.playlist.ownerId === this.userService.user()?.id;
  }

  public get isFollowing(): boolean {
    return this.store.isFollowing();
  }

  public get isLoading(): boolean {
    return this.store.isLoading();
  }

  public get visibleTracks(): number {
    return this.layoutService.getVisibleTracks();
  }

  public get trackListHeight(): number {
    return this.layoutService.trackListHeight;
  }

  public get viewHeaderHeight(): number {
    return this.layoutService.viewHeaderHeight;
  }
}
