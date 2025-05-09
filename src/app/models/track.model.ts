import { Artist } from "./artist.model";

export interface Track {
    id: string;
    name: string;
    artists: Artist[];
    albumName: string | null;
    albumImageUrl: string | null;
    durationMs: number;
    previewUrl: string | null;
    index: number;
    playlistId?: string;
    uri: string;
}
