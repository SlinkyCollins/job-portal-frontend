import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const API = {
    SEEKER_PROFILE: 'dashboard/seeker/seeker_profile',
    EMPLOYER_PROFILE: 'dashboard/employer/get_profile'
  };

  // Clone the request and add the Authorization header if a token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle responses and errors
  return next(req).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        // Skip auto-redirect for non-critical endpoints (e.g., profile fetches for guests)
        const skipRedirectUrls = [API.SEEKER_PROFILE, API.EMPLOYER_PROFILE];
        const shouldSkip = skipRedirectUrls.some(url => req.url.includes(url));
        
        if (!shouldSkip) {
          // Redirect and clear storage for protected endpoints
          router.navigate(['/login']);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
        // For skipped endpoints, just log or handle silently (no redirect)
      }
      return throwError(() => error);
    })
  );
};