import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist, Playlist, PlaylistsObject } from '../models/spotify.model';
import { SidenavComponent } from './sidenav/sidenav.component';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { LayoutService } from '../services/layout.service';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { CloudFiles, TrackFile } from '../models/cloud.model';
import { CloudService } from '../services/cloud.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { PlayingInfoComponent } from './playing-info/playing-info.component';
import { DrawerService } from '../services/drawer.service';
import { SpotifyService } from '../services/spotify.service';
import { CustomScrollbarDirective } from '../directives/custom-scrollbar.directive';
import { UserFirebaseData } from '../models/firebase.model';
import { UtilsService } from '../services/utils.service';
import { doc, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { AudioService } from '../services/audio.service';
import { StreamState } from '../models/stream-state.model';
import { AudioPlayerService } from './services/audio-player.service';
import { PlaylistManagerService } from './services/playlist-manager.service';
import { ScrollManagerService } from './services/scroll-manager.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-layout',
  imports: [
    SidenavComponent,
    RouterOutlet,
    PlayerComponent,
    PlayingInfoComponent,
    CommonModule,
    MatDrawer,
    MatSidenavModule,
    CustomScrollbarDirective,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  files!: CloudFiles; // TODO: Cloud files have to contain the liked songs, too. To be able to play them as playlist
  trackIndex!: number;
  sidenavExpanded: boolean = false;
  sidenavWidth!: number;
  drawerEndStatus: boolean = false;
  userFirebaseData!: UserFirebaseData;
  movedToFolderStatus!: boolean;
  myPlaylists!: PlaylistsObject;
  myTracksTotal!: number;
  folderUnassignedPlaylists!: Playlist[];
  playingTrack!: TrackFile;
  playlist!: Playlist;
  artists!: Artist[];
  state!: StreamState;
  repeatMode!: number;
  isFullScreen: boolean = false;
  isShuffled: boolean = false;
  private unsub!: () => void;
  private firestore: Firestore = inject(Firestore);
  private destroy$ = new Subject<void>();

  constructor(
    private layoutService: LayoutService,
    private cloudService: CloudService,
    private drawerService: DrawerService,
    private spotifyService: SpotifyService,
    public utilsService: UtilsService,
    public audioService: AudioService,
    private audioPlayerService: AudioPlayerService,
    private playlistManager: PlaylistManagerService,
    private scrollManager: ScrollManagerService,
    private userService: UserService,
  ) {
    this.subscribeTo();
  }

  ngOnInit(): void {
    this.initializeMyMusicData();
    this.layoutService.adjustHeightOnWindowResize();
    this.layoutService.handleDrawerOnResize(this.drawerEndStatus);
    this.setupUserSnapshotListener();
  }

  ngAfterViewInit(): void {
    this.scrollManager.registerScrollContainer(this.scrollContainer);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.scrollManager.unregister();
    this.unsub();
  }
  
  private subscribeTo(): void {
    this.subscribeToPlaylists();
    this.subscribeToPlayingTrack();
    combineLatest([
      this.cloudService.observeFiles(),
      this.drawerService.observeSidenavExpanded(),
      this.drawerService.observeSidenavWidth(),
      this.drawerService.observedrawerEndStatus(),
      this.audioService.observeStreamState(),
      this.audioService.observeRepeatMode(),
      this.audioService.observeIsShuffled(),
      this.layoutService.observeFullscreenState(),
      this.cloudService.observeMyTracks(),
      this.utilsService.observeToFolderStatus(),
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([files, expanded, width, status, state, mode, shuffled, isFullScreen, tracks, movedStatus]) => {
        this.files = files;
        this.sidenavExpanded = expanded;
        this.sidenavWidth = width;
        this.drawerEndStatus = status;
        this.state = state;
        this.repeatMode = mode;
        this.isShuffled = shuffled;
        this.isFullScreen = isFullScreen;
        this.myTracksTotal = tracks.total;
        this.movedToFolderStatus = movedStatus;
      });
  }

  private subscribeToPlaylists(): void {
    this.cloudService.observeMyPlaylists()
      .pipe(takeUntil(this.destroy$))
      .subscribe(playlists => {
        this.myPlaylists = playlists;
        if (this.userFirebaseData) {
          this.folderUnassignedPlaylists = this.playlistManager.updateUserPlaylists(
            this.userFirebaseData,
            this.myPlaylists
          );
        }
      });
  }

  private subscribeToPlayingTrack(): void {
    this.audioPlayerService.observePlayingTrack()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (track: TrackFile) => {
        if (track) {
          this.playingTrack = track;
          const playlistId = track.playlistId;
          if (playlistId && this.playlist?.id !== playlistId) {
            this.playlist = await this.playlistManager.loadPlaylist(playlistId);
          }
          this.artists = await this.playlistManager.loadArtists(track);
          await this.spotifyService.loadPreviewUrlIfMissing(track);
          this.audioPlayerService.playAudio(track, this.files, () => this.audioPlayerService.handleTrackPlaybackEnd(
            track,
            this.files,
            this.repeatMode,
            this.isShuffled,
            this.isLastPlaying
          ));
        }
      });
  }

  async setupUserSnapshotListener() {
    const userId = await this.userService.getUserId();
    const userDocRef = doc(this.firestore, 'users', userId);
    
    this.unsub = onSnapshot(userDocRef, (doc) => {
      this.userFirebaseData = doc.data() as UserFirebaseData;
      this.folderUnassignedPlaylists = this.playlistManager.findUnassignedPlaylists(
        this.userFirebaseData,
        this.myPlaylists
      );
    });
  }

  async initializeMyMusicData() {
    this.playlistManager.setMyTracks();
    this.playlistManager.setMyPlaylists();
    this.playingTrack = await this.playlistManager.loadUserDefaultTrack();
    this.artists = await this.playlistManager.loadArtists(this.playingTrack);
  }

  public get isLastPlaying(): boolean {
    return this.playingTrack?.playlistId
    ? this.playingTrack.index >= this.files.tracks.length - 1
    : true;
  }
}
