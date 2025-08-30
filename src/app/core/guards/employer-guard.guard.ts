import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

export const employerGuardGuard: CanActivateFn = (route, state) => {
  let role = localStorage.getItem('role');
  let router = inject(Router);
  let authService = inject(AuthService);

  if (!role) {
    return authService.getUserData().pipe(
      tap((response: any) => {
        if (response?.status && response.user.role === 'employer') {
          localStorage.setItem('role', response.user.role);
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