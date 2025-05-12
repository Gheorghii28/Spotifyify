import { Component, Input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-skeleton',
  imports: [
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() count!: number;
  @Input() height!: number;
  @Input() width!: number;
  @Input() appearance: '' | 'circle' | 'line' | 'custom-content' = '';
  animation: 'progress' | 'progress-dark' | 'pulse' | false = 'progress';

  public get theme() {
    return {
      'border-radius': '10px',
      height: `${this.height}px`,
      width: `${this.width}px`,
      'background-color': '#323232',
      border: '1px solid #323232',
      'animation-duration': '2s',
    };
  }
}
