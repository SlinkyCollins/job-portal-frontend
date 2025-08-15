import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { environment } from '../environments/environment';

// Firebase imports for standalone APIs
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideToastr({
      timeOut: 5000,  // Toast duration (5 seconds)
      positionClass: 'toast-top-right',  // Position
      preventDuplicates: true,  // Avoid duplicate toasts
      progressBar: true,  // Show progress bar
      closeButton: true,  // Add close button
      enableHtml: true,  // Allow HTML in messages
      tapToDismiss: false  // Prevent dismiss by clicking
    }),

    // Firebase setup
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ]
};
