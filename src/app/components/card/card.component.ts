import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../models/spotify.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() data!: Playlist;

  constructor(private router: Router) {}

  ngOnInit() {}

  truncateText(text: string, maxTextLength: number): string {
    if (text.length > maxTextLength) {
      return text.substring(0, maxTextLength) + '...';
    }
    return text;
  }

  navigateToPlaylist(id: string): void {
    this.router.navigate(['/playlist', id]);
  }
}
