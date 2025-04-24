import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(@Inject(Router) private router: Router) { }

  private go(path: string | any[], extras?: any): Promise<boolean> {
    return this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }

  getCurrentUrl(): string {
    return this.router.url;
  }

  login(): Promise<boolean> {
    return this.go('/login'); 
  }

  home(): Promise<boolean> {
    return this.go('/home');
  }

  search(): Promise<boolean> {
    return this.go('/search');
  }

  playlist(id: string): Promise<boolean> {
    return this.go(['/playlist', id]);
  }

  likedSongs(): Promise<boolean> {
    return this.go('/my-tracks');
  }

  profile(): Promise<boolean> {
    return this.go('/profile');
  }

  artist(id: string): Promise<boolean> {
    return this.go(['/artist', id]);  
  }

  settings(): Promise<boolean> {
    return this.go('/settings');
  }

  profileWithState(user: any): Promise<boolean> {
    return this.go('/profile', { state: { user } });
  }

  to(path: string | any[], extras?: any): Promise<boolean> {
    return this.go(path, extras);
  }
}
