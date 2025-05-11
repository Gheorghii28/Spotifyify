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
import { AudioService, ScrollService, UserService, UtilsService } from '../../services';
import { PlaylistManagerService } from '../../layout/services/playlist-manager.service';
import { StreamState } from '../../models/stream-state.model';
import { PlaylistStore } from '../../store/playlist.store';

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
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private store = inject(PlaylistStore);

  private destroyEffect!: EffectRef;
  private windowHeight!: number;
  private headerHeight: number = 320;
  private currentIndex: number = 0;
  private trackListHeight = 43;
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
    this.windowHeight = window.innerHeight;
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
    this.windowHeight = window.innerHeight;
    this.loadMoreTracks();
  }

  private loadMoreTracks(): void {
    const visibleTracks = Math.ceil((this.windowHeight - this.headerHeight) / this.trackListHeight);
    const newTracks = this.playlist.tracks.slice(
      this.currentIndex,
      this.currentIndex + visibleTracks
    );
    this.displayedTracks = [...this.displayedTracks, ...newTracks];
    this.currentIndex += visibleTracks;
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
        await this.playlistManager.changePlaylistDetails(result);
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
}
