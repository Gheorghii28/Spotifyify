import { SpotifyArtistDto } from "./spotify-artist.dto";
import { SpotifyExternalUrlsDto } from "./spotify-external.dto";
import { SpotifyImageDto } from "./spotify-image.dto";

export interface SpotifyAlbumDto {
  album_type: string;
  artists: SpotifyArtistDto[];
  available_markets: string[];
  external_urls: SpotifyExternalUrlsDto;
  href: string;
  id: string;
  images: SpotifyImageDto[] | null;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface SpotifyArtistAlbumsDto {
  href: string;
  items: SpotifyAlbumDto[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}