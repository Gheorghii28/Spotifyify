import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/services/auth.service';
import { CustomButtonComponent } from '../buttons/custom-button/custom-button.component';
import { Router } from '@angular/router';

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
    private router: Router,
  ) {}

  public logout(): void {
    this.authService.logout();
  }

  public async toProfile(): Promise<void> {
    this.router.navigate(['/profile']);
  }

  public toSettings(): void {}
}
