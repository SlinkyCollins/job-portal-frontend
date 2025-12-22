import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // 1. Check LocalStorage first (Fastest)
  const localRole = localStorage.getItem('role');

  if (localRole) {
    if (localRole === 'admin') {
      return true; // ✅ Allowed
    } else {
      // ❌ Wrong Role (e.g., Seeker trying to access Admin)
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

        if (userRole === 'admin') {
          return true; // ✅ Allowed
        } else {
          // ❌ Wrong Role
          authService.redirectBasedOnRole(userRole);
          return false;
        }
      }
      // Not logged in or invalid response
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};