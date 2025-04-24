import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-btn-full-screen',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './btn-full-screen.component.html',
  styleUrl: './btn-full-screen.component.scss',
})
export class BtnFullScreenComponent {
  @Input() elem: any;

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    this.updateFullscreenState();
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  private fullscreenmodes(event: any): void {
    this.updateFullscreenState();
  }

  private updateFullscreenState(): void {
    this.layoutService.updateFullscreenState();
  }

  public requestFullscreen(): void {
    this.layoutService.requestFullscreen(this.elem);
  }

  public exitFullscreen(): void {
    this.layoutService.exitFullscreen();
  }
}
