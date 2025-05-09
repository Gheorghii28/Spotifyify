import { Playlist } from "./playlist.model";

export interface User {
    id: string;
    name: string;
    email: string;
    country: string;
    imageUrl: string;
    folders: UserFolder[];
}

export interface UserFolder {
    id: string;
    name: string;
    playlists: Playlist[];
}
