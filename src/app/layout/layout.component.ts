import { Component } from '@angular/core';
import { TokenService } from '../services/token.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  constructor(private tokenService: TokenService) {
    this.tokenService.saveTokensToLocalStorage();
    this.tokenService.clearTokensFromCookies();
  }
}
