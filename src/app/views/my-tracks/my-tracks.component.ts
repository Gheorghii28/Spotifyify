import { Component, effect, OnInit } from '@angular/core';
import { TracksObjectItem } from '../../models/spotify.model';
import { CloudService } from '../../services/cloud.service';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import {
  MyTracks,
  MyTracksClass,
  TrackFile,
  TrackFileClass,
} from '../../models/cloud.model';
import { AudioService } from '../../services/audio.service';
import { TrackListHeaderComponent } from '../../components/track-list-header/track-list-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tracks',
  imports: [
    ViewHeaderComponent,
    TrackListHeaderComponent,
    TrackListComponent,
    CommonModule,
  ],
  templateUrl: './my-tracks.component.html',
  styleUrl: './my-tracks.component.scss',
})
export class MyTracksComponent implements OnInit {
  myTracks!: MyTracks;

  constructor(
    public cloudService: CloudService,
    public audioService: AudioService
  ) {
    effect(async () => {
      const items: TracksObjectItem[] = cloudService.myTracks().items;
      if (items) {
        const myTracks = await this.createTrackFiles(items);
        if (myTracks.length > 0) {
          this.myTracks.tracks = myTracks;
        }
      }
    });
  }

  ngOnInit(): void {
    this.myTracks = new MyTracksClass();
  }

  private async createTrackFiles(
    items: TracksObjectItem[]
  ): Promise<TrackFile[]> {
    const myTracks = this.createTrackFile(items).slice(0, 50);
    const updatedTracks: TrackFile[] =
      await this.cloudService.updateTrackLikedStatus(myTracks);
    return updatedTracks;
  }

  private createTrackFile(items: TracksObjectItem[]): TrackFile[] {
    return items.map(
      (item, index) =>
        new TrackFileClass(item.track, index, undefined, item.track.album.id)
    );
  }
}
