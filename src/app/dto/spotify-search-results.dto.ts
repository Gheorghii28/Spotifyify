export interface SpotifySearchedResultDto<T> {
    message: string;
    [key: string]: SpotifySearchResult<T> | string;
}

export interface SpotifySearchResult<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}

export type SpotifySearchType =
    | 'album'
    | 'artist'
    | 'playlist'
    | 'track'
    | 'show'
    | 'episode'
    | 'audiobook';
