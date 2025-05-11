import {
    patchState,
    signalStore,
    withHooks,
    withMethods,
    withState,
} from '@ngrx/signals';
import { Playlist } from '../models';
import { inject } from '@angular/core';
import { SpotifyService } from '../services';
import { lastValueFrom } from 'rxjs';

export const PlaylistStore = signalStore(
    { providedIn: 'root' },
    withState(() => ({
        playlist: null as Playlist | null,
        isFollowing: false,
        isLoading: false,
        cache: {} as PlaylistCache,
    })),
    withMethods((store, spotifyService = inject(SpotifyService)) => ({
        async loadPlaylist(id: string): Promise<void> {
            this.setLoading(true);
            const inCache = await this.loadFromCache(id);
            if (!inCache) {
                await this.loadFromApi(id);
            }
        },

        async loadFromCache(id: string): Promise<boolean> {
            const cache = store.cache;
            const playlist = cache()[id];

            if (!playlist) return false;

            const isFollowing = await lastValueFrom(spotifyService.checkIfCurrentUserFollowsPlaylist(id));
            patchState(store, {
                playlist,
                isFollowing,
                isLoading: false,
            });
            return true;
        },

        async loadFromApi(id: string): Promise<void> {
            const playlist = await lastValueFrom(spotifyService.getPlaylist(id));
            const isFollowing = await lastValueFrom(spotifyService.checkIfCurrentUserFollowsPlaylist(id));

            patchState(store, (state) => ({
                playlist,
                isFollowing,
                isLoading: false,
                cache: {
                    ...state.cache,
                    [id]: playlist,
                },
            }));
        },

        updateCachedPlaylist(id: string, changes: Partial<Playlist>): void {
            patchState(store, (state) => {
                const existing = state.cache[id];
                if (!existing) return {};

                return {
                    cache: {
                        ...state.cache,
                        [id]: {
                            ...existing,
                            ...changes,
                        },
                    },

                    // If the currently visible playlist is this one → update it as well
                    playlist: state.playlist?.id === id
                        ? {
                            ...state.playlist,
                            ...changes,
                        }
                        : state.playlist,
                };
            });
        },

        setLoading(isLoading: boolean): void {
            patchState(store, { isLoading });
        },
    })),
    withHooks({
        onInit() {
            console.log('PlaylistStore initialized');
        },
    })
);

type PlaylistCache = Record<string, Playlist>;