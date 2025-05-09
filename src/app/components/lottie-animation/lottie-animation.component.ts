import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AnimationItem, AnimationSegment } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { LottieAnimationConfig } from '../../models/animation.model';

@Component({
  selector: 'app-lottie-animation',
  imports: [CommonModule, LottieComponent],
  templateUrl: './lottie-animation.component.html',
  styleUrl: './lottie-animation.component.scss'
})
export class LottieAnimationComponent implements OnChanges {
  @Input() likedStatus!: boolean | undefined;
  @Input() config!: LottieAnimationConfig;
  private animationItem!: AnimationItem;

  options: AnimationOptions = {
    path: '',
    loop: false,
    autoplay: false
  };
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.options = {
        path: this.config.path,
        loop: this.config.loop ?? false,
        autoplay: this.config.autoplay ?? false
      };
    }
    if (changes[this.config.statusType] && this.animationItem) {
      if (this.likedStatus) {
        this.animationItem.playSegments(this.config.frameMap['like'] as AnimationSegment, true);
      } else {
        this.animationItem.playSegments(this.config.frameMap['unlike'] as AnimationSegment, true);
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    this.goToCorrectFrame();
  }

  private goToCorrectFrame(): void {
    if (!this.animationItem) return;

    if (this.likedStatus) {
      this.animationItem.goToAndStop(this.config.frameMap['idle'][0], true);
    } else {
      this.animationItem.goToAndStop(0, true);
    }
  }
}
