import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { SongsComponent } from './views/songs/songs.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './views/home/home.component';

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
      { path: 'songs', component: SongsComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
