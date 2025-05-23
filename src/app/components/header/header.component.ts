import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import { User } from '../../models';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, FormsModule, CommonModule, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() user!: User;
  @ViewChild('userNotifications', { read: ElementRef })
  userNotifications!: ElementRef;
  @ViewChild('userInbox', { read: ElementRef }) userInbox!: ElementRef;
  @ViewChild('userInfo', { read: ElementRef }) userInfo!: ElementRef;
  @ViewChild('userName', { read: ElementRef }) userName!: ElementRef;
  constructor() { }
}
