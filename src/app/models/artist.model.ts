export interface Artist {
  id: string;
  name: string;
  imageUrl: string | null;
  genres: string[];
  followers: number;
}
