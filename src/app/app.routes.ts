import { Routes } from '@angular/router';
import { accountGuard, authGuard } from './auth/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./views/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'playlist/:id',
        loadComponent: () =>
          import('./views/playlist/playlist.component').then(
            (m) => m.PlaylistComponent
          ),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./views/search/search.component').then(
            (m) => m.SearchComponent
          ),
      },
      {
        path: 'my-tracks',
        loadComponent: () =>
          import('./views/my-tracks/my-tracks.component').then(
            (m) => m.MyTracksComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./views/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./views/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'artist/:id',
        loadComponent: () =>
          import('./views/artist/artist.component').then(
            (m) => m.ArtistComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [accountGuard],
  },
  { path: '**', redirectTo: '' },
];
