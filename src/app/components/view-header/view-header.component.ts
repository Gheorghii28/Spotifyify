import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BtnPlayComponent } from '../buttons/btn-play/btn-play.component';
import { CloudFiles } from '../../models/cloud.model';

@Component({
  selector: 'app-view-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, BtnPlayComponent],
  templateUrl: './view-header.component.html',
  styleUrl: './view-header.component.scss',
})
export class ViewHeaderComponent {
  @Input() data!: CloudFiles;
}
