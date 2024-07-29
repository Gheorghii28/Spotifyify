import { Artist, Playlist, SpotifySearchTrack, Track } from './spotify.model';

export interface CloudFiles {
  name: string;
  description: string;
  followers: number | undefined;
  id: string;
  imageUrl: string | null;
  tracks: TrackFile[];
  type: string;
  color: string;
}

export interface TrackFile {
  name: string;
  albumName: string;
  artists: { name: string; id: string }[];
  durationMs: number;
  id: string;
  previewUrl: string;
  index: number;
  img: string;
  playlistId?: string;
  albumId?: string;
  likedStatus: boolean;
}

export class CloudFilesClass implements CloudFiles {
  name: string;
  description: string;
  followers: number | undefined;
  id: string;
  imageUrl: string | null;
  tracks: TrackFile[];
  type: string;
  color: string;

  constructor(file: Playlist, tracks: TrackFile[]) {
    this.name = file.name;
    this.description = file.description;
    this.followers = file.followers?.total;
    this.id = file.id;
    this.imageUrl = this.getImgUrl(file);
    this.tracks = tracks;
    this.type = file.type;
    this.color = file.primary_color;
  }

  private getImgUrl(file: Playlist): string | null {
    return file.images?.[0]?.url || null;
  }
}

export class TrackFileClass implements TrackFile {
  name: string;
  albumName: string;
  artists: { name: string; id: string }[];
  durationMs: number;
  id: string;
  previewUrl: string;
  index: number;
  img: string;
  playlistId: string | undefined;
  albumId: string | undefined;
  likedStatus: boolean;

  constructor(
    track: Track | SpotifySearchTrack,
    index: number,
    playlistId: string | undefined,
    albumId: string | undefined
  ) {
    this.name = track.name;
    this.albumName = track.album.name;
    this.artists = this.getArtists(track.artists);
    this.durationMs = track.duration_ms;
    this.id = track.id;
    this.previewUrl = track.preview_url as string;
    this.index = index;
    this.img = track.album.images[0].url;
    this.playlistId = playlistId;
    this.albumId = albumId;
    this.likedStatus = false;
  }

  private getArtists(artists: Artist[]): { name: string; id: string }[] {
    return artists.map((artist: Artist) => ({
      name: artist.name,
      id: artist.id,
    }));
  }
}

export interface MyTracks {
  color: string;
  imageUrl: string | undefined;
  name: string;
  type: string;
  description: string;
  tracks?: TrackFile[]
}

export class MyTracksClass implements MyTracks {
  color: string;
  imageUrl: string | undefined;
  name: string;
  type: string;
  description: string;

  constructor() {
    this.color = '#460bf3';
    this.imageUrl = undefined;
    this.name = 'Liked Songs';
    this.type = 'my tracks';
    this.description =
      'A collection of songs that I have liked over time. These tracks are my personal favorites and reflect my music taste.';
  }
}
