import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/services/auth.service';
import { CustomButtonComponent } from '../buttons/custom-button/custom-button.component';
import { NavigationService } from '../../services/navigation.service';

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
    public navigationService: NavigationService
  ) {}

  public logout(): void {
    this.authService.logout();
  }

  public async toProfile(): Promise<void> {
    this.navigationService.profile();
  }

  public toSettings(): void {
    this.navigationService.settings();
  }
}
