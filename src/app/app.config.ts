import { ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserStorageService } from './services/browser-storage.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AudioService, NullAudioService } from './services/audio.service';
import { isPlatformBrowser } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    BrowserStorageService,
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    {
      provide: AudioService,
      useFactory: (platformId: Object) => {
        return isPlatformBrowser(platformId) ? new AudioService() : new NullAudioService();
      },
      deps: [PLATFORM_ID]
    }
  ],
};
