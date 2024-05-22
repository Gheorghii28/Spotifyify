import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './views/home/home.component';
import { PlaylistComponent } from './views/playlist/playlist.component';

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
      { path: 'home', component: HomeComponent },
      { path: 'playlist/:id', component: PlaylistComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
