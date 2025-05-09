import { SpotifyAlbumDto } from "./spotify-album.dto";
import { SpotifySimpleArtistDto } from "./spotify-artist.dto";
import { SpotifyExternalIdsDto, SpotifyExternalUrlsDto } from "./spotify-external.dto";

export interface SpotifyTrackDto {
  album: SpotifyAlbumDto | null;
  artists: SpotifySimpleArtistDto[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: SpotifyExternalIdsDto;
  external_urls: SpotifyExternalUrlsDto;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistTracksDto {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyPlaylistTrackItemDto[];
}

export interface SpotifyPlaylistTrackItemDto {
  added_at: string;
  added_by: {
    external_urls: SpotifyExternalUrlsDto;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: string | null;
  track: SpotifyTrackDto;
  video_thumbnail: {
    url: string | null;
  };
}