import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '**', redirectTo: '' },
  { path: '', component: LayoutComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent }
];
