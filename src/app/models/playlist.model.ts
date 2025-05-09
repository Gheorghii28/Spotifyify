import { Track } from "./track.model";

export interface Playlist {
    id: string;
    name: string;
    description: string;
    color: string;
    type: string;
    imageUrl: string | null;
    ownerName: string | null;
    ownerId: string | null;
    spotifyUrl: string | null;
    totalTracks: number;
    tracks: Track[];
    snapshotId: string;
    isUserCreated?: boolean;
}