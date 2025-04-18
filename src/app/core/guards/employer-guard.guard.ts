import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

export const employerGuardGuard: CanActivateFn = (route, state) => {
  let user = localStorage.getItem('userId');
  let router = inject(Router);
  let authService = inject(AuthService);

  if (!user) {
    return authService.getUserSession().pipe(
      tap((response: any) => {
        if (response?.status && response.user.role === 'employer') {
          localStorage.setItem('userId', response.user.user_id);
        } else {
          router.navigate(['/login']);
        }
      }),
      tap({
        error: () => router.navigate(['/login'])
      })
    );
  }
  
  return true;
};