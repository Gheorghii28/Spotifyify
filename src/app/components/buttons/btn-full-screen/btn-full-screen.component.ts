import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { HeightService } from '../../../services/height.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-btn-full-screen',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './btn-full-screen.component.html',
  styleUrl: './btn-full-screen.component.scss',
})
export class BtnFullScreenComponent {
  @Input() elem: any;
  public isFullScreen: boolean = false;

  constructor(private heightService: HeightService) {}

  ngOnInit(): void {
    this.heightService.chkScreenMode();
    this.heightService.isFullscreen$().subscribe((isFullScreen: boolean) => {
      this.isFullScreen = isFullScreen;
    });
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  private fullscreenmodes(event: any): void {
    this.chkScreenMode();
  }

  private chkScreenMode(): void {
    this.heightService.chkScreenMode();
  }

  public openFullscreen(): void {
    this.heightService.openFullscreen(this.elem);
  }

  public closeFullscreen(): void {
    this.heightService.closeFullscreen();
  }
}
