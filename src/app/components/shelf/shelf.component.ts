import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { ShelfData } from '../../models/spotify.model';

@Component({
  selector: 'app-shelf',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent {
  @Input() data!: ShelfData;
}
