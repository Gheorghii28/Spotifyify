import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CloudFiles, MyTracks } from '../../models/cloud.model';

@Component({
  selector: 'app-view-header',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './view-header.component.html',
  styleUrl: './view-header.component.scss',
})
export class ViewHeaderComponent {
  @Input() data!: CloudFiles | MyTracks;
}
