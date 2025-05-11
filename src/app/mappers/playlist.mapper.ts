import { SpotifyPlaylistDto } from "../dto";
import { Playlist, Track } from "../models";
import { TrackMapper } from "./track.mapper";

export class PlaylistMapper {
  public static toModel(dto: SpotifyPlaylistDto): Playlist {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      color: dto.primary_color,
      type: dto.type,
      imageUrl: dto.images?.[0]?.url || null,
      ownerName: dto.owner?.display_name || null,
      ownerId: dto.owner?.id || null,
      spotifyUrl: dto.external_urls?.spotify || null,
      totalTracks: dto.tracks.total,
      tracks: Array.isArray(dto.tracks.items)
        ? dto.tracks.items.map((item, index) =>
          TrackMapper.toModel(item.track, index)
        )
        : [],
      snapshotId: dto.snapshot_id,
};
  }

  public static createDefault(name: string = 'Neue Playlist', tracks: Track[] = [], type: string = 'Custom'): Playlist {
    return {
      id: crypto.randomUUID(),
      name: name,
      description: '',
      color: '#A2B9D4',
      type: type,
      imageUrl: null,
      ownerName: 'User',
      ownerId: null,
      spotifyUrl: null,
      totalTracks: 0,
      tracks: tracks,
      snapshotId: crypto.randomUUID(),
    };
  }
}
