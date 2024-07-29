import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
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
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
