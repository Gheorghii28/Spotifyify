export interface LottieAnimationConfig {
    path: string;
    frameMap: { [key: string]: number[] };
    action: string;
    width: string;
    height: string;
    loop: boolean;
    autoplay: boolean;
    statusType: string;
  }
  