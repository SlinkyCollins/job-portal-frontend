import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const jobSeekerGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const localRole = localStorage.getItem('role'); // Check for user invite (user role)

  if (localRole) {
    if (localRole === 'job_seeker') {
      return true; // ✅ Allowed (If you have the invite, go right in!)
    } else {
      authService.redirectBasedOnRole(localRole);
      return false;
    }
  }

  // If no invite, call parents (backend) to check if the user have invite for the party (dashboard)
  return authService.getUserData().pipe(
    map((response: any) => {
      if (response?.status && response.user.role) {
        const userRole = response.user.role;
        localStorage.setItem('role', userRole); // Write role on party list

        if (userRole === 'job_seeker') {
          return true; // ✅ Allowed
        } else {
          authService.redirectBasedOnRole(userRole);
          return false;
        }
      }
      router.navigate(['/login']);  // Send home
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);  // Error? Send home
      return of(false);
    })
  );
};