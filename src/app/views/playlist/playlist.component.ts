import { Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
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
import { AudioService, SpotifyService } from '../../services';
import { PlaylistManagerService } from '../../layout/services/playlist-manager.service';
import { StreamState } from '../../models/stream-state.model';

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
  private spotifyService = inject(SpotifyService);
  private playlistManager = inject(PlaylistManagerService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  isFollowing!: boolean;
  playlistId: WritableSignal<string | null> = signal(null);
  currentPlaylist: WritableSignal<Playlist | undefined> = signal(undefined);

  constructor() {
    this.setupPlaylistEffect();
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const id = params['id'];
      this.playlistId.set(id);
    });
  }

  private setupPlaylistEffect(): void {
    effect(async () => {
      const id = this.playlistId();
      const playlists = this.playlistManager.myPlaylists();
      if (!id) return;

      const playlist = await this.getPlaylistById(id, playlists);
      this.currentPlaylist.set(playlist);

      this.isFollowing = await lastValueFrom(
        this.spotifyService.checkIfCurrentUserFollowsPlaylist(id)
      );
    });
  }

  public get playlist(): Playlist {
    return this.currentPlaylist()!;
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
      }
    });
  }

  private async getPlaylistById(id: string, playlists: Playlist[]): Promise<Playlist> {
    let playlist = playlists.find(p => p.id === id);
    if (!playlist) {
      playlist = await lastValueFrom(this.spotifyService.getPlaylist(id));
    }
    playlist.tracks = await lastValueFrom(this.spotifyService.getPlaylistTracks(id));
    return playlist;
  }

  public get playingTrack(): Track {
    return this.audioService.playingTrack()!;
  }

  public get state(): StreamState {
    return this.audioService.state()!;
  }
}
