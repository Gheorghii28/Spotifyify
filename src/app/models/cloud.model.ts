import { Artist, Playlist, Track } from './spotify.model';

export interface CloudFiles {
  name: string;
  description: string;
  followers: number | undefined;
  id: string;
  imageUrl: string;
  tracks: TrackFile[];
  type: string;
  color: string;
}

export interface TrackFile {
  name: string;
  albumName: string;
  artists: string[];
  durationMs: number;
  id: string;
  previewUrl: string;
  index: number;
  img: string;
  playListId: string;
  likedStatus: boolean;
}

export class CloudFilesClass implements CloudFiles {
  name: string;
  description: string;
  followers: number | undefined;
  id: string;
  imageUrl: string;
  tracks: TrackFile[];
  type: string;
  color: string;

  constructor(file: Playlist, tracks: TrackFile[]) {
    this.name = file.name;
    this.description = file.description;
    this.followers = file.followers?.total;
    this.id = file.id;
    this.imageUrl = file.images[0].url;
    this.tracks = tracks;
    this.type = file.type;
    this.color = file.primary_color;
  }
}

export class TrackFileClass implements TrackFile {
  name: string;
  albumName: string;
  artists: string[];
  durationMs: number;
  id: string;
  previewUrl: string;
  index: number;
  img: string;
  playListId: string;
  likedStatus: boolean;

  constructor(track: Track, index: number, playListId: string) {
    this.name = track.name;
    this.albumName = track.album.name;
    this.artists = this.getArtists(track.artists);
    this.durationMs = track.duration_ms;
    this.id = track.id;
    this.previewUrl = track.preview_url;
    this.index = index;
    this.img = track.album.images[0].url;
    this.playListId = playListId;
    this.likedStatus = false;
  }

  private getArtists(artists: Artist[]): string[] {
    return artists.map((artist: Artist) => artist.name);
  }
}
