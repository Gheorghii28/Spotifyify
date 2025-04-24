import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist, Playlist } from '../models/spotify.model';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LayoutService } from '../services/layout.service';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { TrackFile } from '../models/cloud.model';
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
  initialTrack!: TrackFile;
  trackIndex!: number;
  userFirebaseData!: UserFirebaseData;
  folderUnassignedPlaylists!: Playlist[];
  playlist!: Playlist;
  artists!: Artist[];
  private unsub!: () => void;
  private firestore: Firestore = inject(Firestore);

  constructor(
    public layoutService: LayoutService,
    public cloudService: CloudService,
    public drawerService: DrawerService,
    private spotifyService: SpotifyService,
    public utilsService: UtilsService,
    public audioService: AudioService,
    private audioPlayerService: AudioPlayerService,
    private playlistManager: PlaylistManagerService,
    private scrollManager: ScrollManagerService,
    private userService: UserService,
  ) {
    effect(() => {
      if (this.userFirebaseData) {
        this.folderUnassignedPlaylists = this.playlistManager.updateUserPlaylists(
          this.userFirebaseData,
          this.cloudService.myPlaylists()
        );
      }
    });
    effect(async() => {
      if (audioService.currentPlayingTrack().id.length > 0) {
        const track = audioService.currentPlayingTrack();
        const playlistId = track.playlistId;
        if (playlistId && this.playlist?.id !== playlistId) {
          this.playlist = await this.playlistManager.loadPlaylist(playlistId);
        }
        this.artists = await this.playlistManager.loadArtists(track);
        await this.spotifyService.loadPreviewUrlIfMissing(track);
        this.audioPlayerService.playAudio(track, this.cloudService.files(), () => this.audioPlayerService.handleTrackPlaybackEnd(
          track,
          this.cloudService.files(),
          this.audioService.repeatMode(),
          this.audioService.isShuffled(),
          this.isLastPlaying
        ));
      }
    });
  }

  ngOnInit(): void {
    this.initializeMyMusicData();
    this.layoutService.adjustHeightOnWindowResize();
    this.layoutService.handleDrawerOnResize();
    this.setupUserSnapshotListener();
  }

  ngAfterViewInit(): void {
    this.scrollManager.registerScrollContainer(this.scrollContainer);
  }

  ngOnDestroy(): void {
    this.scrollManager.unregister();
    this.unsub();
  }

  async setupUserSnapshotListener() {
    const userId = await this.userService.getUserId();
    const userDocRef = doc(this.firestore, 'users', userId);
    
    this.unsub = onSnapshot(userDocRef, (doc) => {
      this.userFirebaseData = doc.data() as UserFirebaseData;
      this.folderUnassignedPlaylists = this.playlistManager.findUnassignedPlaylists(
        this.userFirebaseData,
        this.cloudService.myPlaylists()
      );
    });
  }

  async initializeMyMusicData() {
    this.playlistManager.setMyTracks();
    this.playlistManager.setMyPlaylists();
    const playingTrack = await this.playlistManager.loadUserDefaultTrack();
    this.initialTrack = playingTrack;
    this.artists = await this.playlistManager.loadArtists(playingTrack);
  }

  public get isLastPlaying(): boolean {
    return this.audioService.currentPlayingTrack().playlistId
    ? this.audioService.currentPlayingTrack().index >= this.cloudService.files().tracks.length - 1
    : true;
  }
}
