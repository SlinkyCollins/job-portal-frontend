import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);


  // Clone the request and add the Authorization header if a token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // If no token
  return next(req).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        // Auto-handle expired token: Clear localStorage and redirect to login
        router.navigate(['/login']);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
      return throwError(() => error);
    })
  );


};
