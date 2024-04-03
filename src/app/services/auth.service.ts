import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  login(): void {
    window.location.href = 'http://localhost:3000/login';
  }
}
