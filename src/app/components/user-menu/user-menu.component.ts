import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { CustomButtonComponent } from '../buttons/custom-button/custom-button.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    CustomButtonComponent,
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  public logout(): void {
    this.authService.logout();
  }

  public toProfile(): void {}

  public toSettings(): void {}
}
