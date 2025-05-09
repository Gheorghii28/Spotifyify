import { Artist } from "./artist.model";

export interface Album {
  id: string;
  name: string;
  artists: Artist[];
  imageUrl: string | null;
  releaseDate: string;
  totalTracks: number;
}
