import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const employerGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // 1. Check LocalStorage first (Fastest)
  const localRole = localStorage.getItem('role');

  if (localRole) {
    if (localRole === 'employer') {
      return true; // ✅ Allowed
    } else {
      // ❌ Wrong Role (e.g., Seeker trying to access Employer)
      authService.redirectBasedOnRole(localRole);
      return false;
    }
  }

  // 2. If no LocalStorage, check Backend (Reliable)
  return authService.getUserData().pipe(
    map((response: any) => {
      if (response?.status && response.user.role) {
        const userRole = response.user.role;
        localStorage.setItem('role', userRole); // Sync local storage

        if (userRole === 'employer') {
          return true; // ✅ Allowed
        } else {
          // ❌ Wrong Role
          authService.redirectBasedOnRole(userRole);
          return false;
        }
      }
      // Not logged in at all
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};