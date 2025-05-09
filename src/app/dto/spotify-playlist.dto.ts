import { SpotifyExternalUrlsDto } from "./spotify-external.dto";
import { SpotifyImageDto } from "./spotify-image.dto";
import { SpotifyOwnerDto } from "./spotify-owner.dto";
import { SpotifyTrackDto } from "./spotify-track.dto";

export interface SpotifyPlaylistDto {
  collaborative: boolean;
  description: string;
  external_urls: SpotifyExternalUrlsDto | null;
  followers?: { href: string; total: number };
  href: string;
  id: string;
  images: SpotifyImageDto[] | null;
  name: string;
  owner: SpotifyOwnerDto | null;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    items?: SpotifyPlaylistTrackItemDto[];
    limit?: number;
    next?: string;
    offset?: number;
    previous?: string;
    total: number;
  };
  type: string;
  uri: string;
}

interface SpotifyPlaylistTrackItemDto {
  added_at: string;
  added_by: {
    external_urls: SpotifyExternalUrlsDto;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  track: SpotifyTrackDto;
}
