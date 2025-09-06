import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, RESPONSE_INIT } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from './api-service.service';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, UserCredential } from '@angular/fire/auth';
import { catchError, from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    public http: HttpClient,
    public router: Router,
    public toastr: ToastrService,
    public apiService: ApiServiceService,
    private auth: Auth,  // Firebase Auth
    private ngZone: NgZone
  ) { }

  logout() {
    this.http.post(`${this.apiService.apiUrl}/logout.php`, {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.toastr.success('Logged out');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('photoURL'); // Clear photoURL
          this.router.navigate(['/login']);
        } else {
          this.toastr.error('Logout failed');
        }
      },
      err => {
        this.toastr.error('Logout failed');
      }
    );
  }

  isLoggedIn(): boolean {
    // You can check for a token, role, or both
    return !!localStorage.getItem('token') && !!localStorage.getItem('role');
  }

  getUserData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/user_data.php`);
  }

  getSeekerData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/seeker_dashboard.php`);
  }

  getEmployerData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/employer_dashboard.php`);
  }

  getAllJobs() {
    return this.http.get(`${this.apiService.apiUrl}/jobs.php`);
  }

  getJobDetails(jobId: number) {
    return this.http.get(`${this.apiService.apiUrl}/jobdetails.php?id=${jobId}`);
  }

  applyToJob(jobId: number) {
    return this.http.post(`${this.apiService.apiUrl}/apply.php`, { jobId });
  }

  addToWishlist(jobId: number) {
    return this.http.post(`${this.apiService.apiUrl}/wishlist.php`, { jobId });
  }

  removeFromWishlist(jobId: number) {
    return this.http.post(`${this.apiService.apiUrl}/wishlist_delete.php`, { jobId });
  }

  signInWithGoogle(): Observable<UserCredential> {
    return from(this.ngZone.run(() => signInWithPopup(this.auth, new GoogleAuthProvider()))).pipe(
      catchError(err => {
        this.toastr.error(err.code === 'auth/popup-closed-by-user' ? 'Popup closed. Try again.' : 'Google login failed');
        throw err;
      })
    );
  }

  signInWithFacebook(): Observable<UserCredential> {
    return from(this.ngZone.run(() => signInWithPopup(this.auth, new FacebookAuthProvider()))).pipe(
      catchError(err => {
        if (err.code === 'auth/account-exists-with-different-credential') {
          this.toastr.error('Account exists with different provider. Try another login method or link accounts.');
          console.error('Facebook login error:', err);
        } else if (err.code === 'auth/popup-closed-by-user') {
          this.toastr.error('Popup closed. Try again.');
        } else {
          this.toastr.error('Facebook login failed');
        }
        throw err;
      })
    );
  }

  handleSocialLogin(credential: UserCredential): void {
    this.ngZone.run(() => {
      const user = credential.user;
      if (user) {
        localStorage.setItem('photoURL', user.photoURL || ''); // Store photoURL
        from(user.getIdToken()).pipe(
          switchMap(token => {
            return this.http.post(`${this.apiService.apiUrl}/social_login.php`, { token });
          })
        ).subscribe({
          next: (response: any) => {
            if (response.status) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('role', response.user.role);
              this.toastr.success('Login successful');
              this.router.navigate([response.user.role === 'job_seeker' ? '/dashboard/jobseeker' : (response.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/admin')]);
            } else if (response.newUser) {
              this.router.navigate(['/role-select'], { state: { uid: user.uid, token: response.token, photoURL: user.photoURL || '' } });
            }
          },
          error: (err) => {
            console.error('Backend error:', err); // Debug
            this.toastr.error('Login failed: ' + (err.message || 'Unknown error'));
          }
        });
      }
    });
  }

  getPhotoURL(): string {
    return localStorage.getItem('photoURL') || '';
  }

  // Add signOut if needed
  firebaseSignOut() {
    this.auth.signOut().then(() => this.logout());  // Chain to your PHP logout
  }

}