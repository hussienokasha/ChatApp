import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      AngularFireModule.initializeApp({
        apiKey: 'AIzaSyAdQlcbSS5M1NOMNjtY9OeNaAAGVc5u39g',
        authDomain: 'angular-chatapp-283da.firebaseapp.com',
        projectId: 'angular-chatapp-283da',
        storageBucket: 'angular-chatapp-283da.firebasestorage.app',
        messagingSenderId: '1060341365273',
        appId: '1:1060341365273:web:5a7423e97ec372c3d2c888',
        measurementId: 'G-NVMNMNDNWF',
      }),
      AngularFireAuthModule
    ),
  ],
};
