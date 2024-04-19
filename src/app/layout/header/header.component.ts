import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../models/spotify.model';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, FormsModule, CommonModule, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchText = '';
  @Input() user!: UserProfile;

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
