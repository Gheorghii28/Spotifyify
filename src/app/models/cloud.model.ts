import { Artist, Playlist, Track } from './spotify.model';

export interface CloudFiles {
  name: string;
  description: string;
  followers: number | undefined;
  id: string;
  imageUrl: string;
  tracks: TrackFile[];
}

export interface TrackFile {
  name: string;
  albumName: string;
  artists: string[];
  durationMs: number;
  id: string;
  previewUrl: string;
  index: number
}

export class CloudFilesClass implements CloudFiles {
  name: string;
  description: string;
  followers: number | undefined;
  id: string;
  imageUrl: string;
  tracks: TrackFile[];

  constructor(file: Playlist, tracks: TrackFile[]) {
    this.name = file.name;
    this.description = file.description;
    this.followers = file.followers?.total;
    this.id = file.id;
    this.imageUrl = file.images[0].url;
    this.tracks = tracks;
  }
}

export class TrackFileClass implements TrackFile {
  name: string;
  albumName: string;
  artists: string[];
  durationMs: number;
  id: string;
  previewUrl: string;
  index: number

  constructor(track: Track, index: number) {
    this.name = track.name;
    this.albumName = track.album.name;
    this.artists = this.getArtists(track.artists);
    this.durationMs = track.duration_ms;
    this.id = track.id;
    this.previewUrl = track.preview_url;
    this.index = index
  }

  private getArtists(artists: Artist[]): string[] {
    return artists.map((artist: Artist) => artist.name);
  }
}
