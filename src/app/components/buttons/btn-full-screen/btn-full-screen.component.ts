import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../../services';

@Component({
  selector: 'app-btn-full-screen',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './btn-full-screen.component.html',
  styleUrl: './btn-full-screen.component.scss',
})
export class BtnFullScreenComponent {
  private layoutService = inject(LayoutService);

  @Input() elem: any;

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

  public get isFullScreen(): boolean {
    return this.layoutService.isFullScreen()!;
  }
}
