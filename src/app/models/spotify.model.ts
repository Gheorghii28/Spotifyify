export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Owner {
  display_name: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: { spotify: string };
  followers?: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    items: any[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface ShelfData {
  message: string;
  playlists: {
    href: string;
    items: Playlist[];
    limit: number;
    next: string;
    offset: string;
    previous: any;
    total: number;
  };
}

export interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string };
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: { spotify: string };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface PlaylistsObject {
  href: string;
  items: Playlist[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface TracksObject {
  href: string;
  items: TracksObjectItem[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

interface TracksObjectItem {
  added_at: string;
  track: Track;
}

export interface SpotifySearchResults {
  albums?: SpotifySearchResult;
  artists?: SpotifySearchResult;
  playlists?: SpotifySearchResult;
  tracks?: SpotifySearchResult;
  shows?: SpotifySearchResult;
  episodes?: SpotifySearchResult;
  audiobooks?: SpotifySearchResult;
}

export interface SpotifySearchResult {
  href: string;
  items: any[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}
