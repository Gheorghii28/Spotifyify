import { computed, Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikedTracksService {

  private likedTrackIds: WritableSignal<Set<string>> = signal(new Set());

  isLiked = (trackId: string) => computed(() => this.likedTrackIds().has(trackId));
  likedCount = computed(() => this.likedTrackIds().size);

  toggleLike(trackId: string): void {
    this.likedTrackIds.update(set => {
      const newSet = new Set(set);
      if (newSet.has(trackId)) newSet.delete(trackId);
      else newSet.add(trackId);
      return newSet;
    });
  }

  setLikedTracks(trackIds: string[]): void {
    this.likedTrackIds.set(new Set(trackIds));
  }

  getLikedTrackIds(): string[] {
    return [...this.likedTrackIds()];
  }

}
