import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Playlist } from '../../models/spotify.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() data!: Playlist;

  constructor() {}

  ngOnInit() {}
}
