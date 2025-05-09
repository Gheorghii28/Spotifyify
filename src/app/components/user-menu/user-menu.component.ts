import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CustomButtonComponent } from '../buttons/custom-button/custom-button.component';
import { AuthService } from '../../auth/services/auth.service';
import { AudioService, NavigationService } from '../../services';

@Component({
  selector: 'app-user-menu',
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
  private authService = inject(AuthService);
  private audioService = inject(AudioService);
  private navigationService = inject(NavigationService);

  public logout(): void {
    this.authService.logout();
    this.audioService.stop();
  }

  public async toProfile(): Promise<void> {
    this.navigationService.profile();
  }

  public toSettings(): void {
    this.navigationService.settings();
  }
}
