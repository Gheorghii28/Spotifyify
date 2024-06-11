import { ApplicationConfig, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserStorageService } from './services/browser-storage.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AudioService, NullAudioService } from './services/audio.service';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { firebaseConfig } from '../../environments/environment';

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
        return isPlatformBrowser(platformId)
          ? new AudioService()
          : new NullAudioService();
      },
      deps: [PLATFORM_ID],
    },
    provideFirebaseApp(() =>
      initializeApp(firebaseConfig)
    ),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],
};
