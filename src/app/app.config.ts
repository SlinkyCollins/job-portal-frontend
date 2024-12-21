import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

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
      })
    ]
};
