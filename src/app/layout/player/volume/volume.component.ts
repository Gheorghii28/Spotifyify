import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { AudioService } from '../../../services/audio.service';
import { BrowserStorageService } from '../../../services/browser-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-volume',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './volume.component.html',
  styleUrl: './volume.component.scss',
})
export class VolumeComponent implements OnInit {
  @ViewChild('sliderVolume') sliderVolume!: ElementRef;
  volume!: number;

  constructor(
    public audioService: AudioService,
    private browserStorageService: BrowserStorageService
  ) {}

  ngOnInit(): void {
    window.onstorage = (event: any) => {
      const newVolume = event.target.localStorage.volume;
      this.volume = newVolume;
    };
    this.initializeVolume();
  }

  private initializeVolume(): void {
    const newVolume = this.browserStorageService.get('volume');
    if (newVolume) {
      this.volume = parseFloat(newVolume as string);
      this.audioService.setVolume(this.volume);
    } else {
      this.updateVolume(0.5);
    }
  }

  public onVolumeChange(): void {
    const volume: number = this.sliderVolume.nativeElement.value;
    this.updateVolume(volume);
  }

  public mute(): void {
    this.updateVolume(0);
  }

  public unmute(): void {
    const previousVolume = this.browserStorageService.get('previousVolume');
    this.updateVolume(parseFloat(previousVolume as string));
  }

  private updateVolume(volume: number): void {
    this.audioService.setVolume(volume);
    this.browserStorageService.set('volume', `${volume}`);
    if (volume !== 0) {
      this.browserStorageService.set('previousVolume', `${volume}`);
    }
    window.dispatchEvent(new Event('storage'));
  }
}
