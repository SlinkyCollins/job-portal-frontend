import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../environments/environment';

// Firebase imports for standalone APIs
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // Provide the interceptor here
    provideAnimations(),
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
  ]
};
