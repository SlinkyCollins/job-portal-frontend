import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

export const jobSeekerGuardGuard: CanActivateFn = (route, state) => {
  let role = localStorage.getItem('role'); // Check for user invite (user role)
  let router = inject(Router);
  let authService = inject(AuthService);

  // If no invite, call parents (backend) to check if the user have invite for the party (dashboard)
  if (!role) {
    return authService.getUserData().pipe(
      tap((response: any) => {
        if (response?.status && response.user.role === 'job_seeker') {
          localStorage.setItem('role', response.user.role);  // Write role on party list
        } else {
          router.navigate(['/login']);  // Send home
        }
      }),
      tap({
        error: () => router.navigate(['/login'])  // Error? Send home
      })
    );
  }
  return true; // If you have the invite, go right in!
};