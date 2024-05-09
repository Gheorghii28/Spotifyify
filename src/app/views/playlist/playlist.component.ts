import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CloudFiles } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [ViewHeaderComponent, TrackListComponent, CommonModule],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {
  playListFile!: CloudFiles;

  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const playlistId = params['id'];
      if (isPlatformBrowser(this.platformId)) {
        this.fetchAndStorePlaylistData(playlistId);
      }
    });
  }

  async fetchAndStorePlaylistData(id: string): Promise<void> {
    try {
      this.playListFile = await this.cloudService.getFiles(id);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
