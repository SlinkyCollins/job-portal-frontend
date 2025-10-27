import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from './api-service.service';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, UserCredential } from '@angular/fire/auth';
import { catchError, from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public isGoogleLoading: boolean = false;
  public isFacebookLoading: boolean = false;

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
          localStorage.removeItem('user_cv'); // Clear uploaded CV
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

  goToDashboard(event: Event) {
    event.preventDefault(); // prevent normal link behavior

    const role = localStorage.getItem('role');

    if (!role) {
      this.toastr.error('Please log in to access your dashboard.');
      this.router.navigate(['/login']);
      return;
    }

    if (role === 'job_seeker') {
      this.router.navigate(['/dashboard/jobseeker']);
      this.toastr.success('Welcome back to your dashboard!');
    }
    else if (role === 'employer') {
      this.router.navigate(['/dashboard/employer']);
      this.toastr.success('Welcome back to your employer dashboard!');
    }
    else if (role === 'admin') {
      this.router.navigate(['/dashboard/admin']);
      this.toastr.success('Welcome back to your admin dashboard!');
    }
    else {
      this.toastr.error('Unknown role. Please log in again.');
      this.router.navigate(['/login']);
    }
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
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

  getSeekerProfile() {
    return this.http.get(`${this.apiService.apiUrl}/get_seeker_profile.php`);
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

  toggleSaveJob(job: any) {
    if (!this.isLoggedIn()) {
      this.toastr.warning('Please log in to save jobs.');
      this.router.navigate(['/login']);
      return;
    }

    // Set loading state for this specific job
    job.isSaving = true;

    if (job.isSaved) {
      // Call backend to unsave
      this.removeFromWishlist(job.job_id).subscribe({
        next: (res: any) => {
          if (res.status) {
            job.isSaved = false;
            this.toastr.success('Job removed from saved jobs.');
          } else {
            this.toastr.error(res.msg);
          }
          job.isSaving = false;
        },
        error: () => {
          this.toastr.error('Error removing saved job.');
          job.isSaving = false;
        },
      });
    } else {
      this.addToWishlist(job.job_id).subscribe({
        next: (res: any) => {
          if (res.status) {
            job.isSaved = true;
            this.toastr.success('Job saved!');
          } else {
            this.toastr.error(res.msg);
          }
          job.isSaving = false;
        },
        error: () => {
          this.toastr.error('Error saving job.');
          job.isSaving = false;
        },
      });
    }
  }

  signInWithGoogle(): Observable<UserCredential> {
    this.isGoogleLoading = true;  // Start loading for Google
    return from(this.ngZone.run(() => signInWithPopup(this.auth, new GoogleAuthProvider()))).pipe(
      catchError(err => {
        this.isGoogleLoading = false;  // Stop on error
        if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          this.toastr.error('Login cancelled. Try again.');
        } else {
          this.toastr.error('Google login failed');
          console.warn('Google login error:', err);
        }
        throw err;
      })
    );
  }

  signInWithFacebook(): Observable<UserCredential> {
    this.isFacebookLoading = true;  // Start loading for Facebook
    return from(this.ngZone.run(() => signInWithPopup(this.auth, new FacebookAuthProvider()))).pipe(
      catchError(err => {
        this.isFacebookLoading = false;  // Stop on error
        if (err.code === 'auth/account-exists-with-different-credential') {
          this.toastr.error('Account exists with different provider. Try another login method.');
          console.warn('Facebook login error:', err);
        } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          this.toastr.error('Login cancelled. Try again.');
        } else {
          this.toastr.error('Facebook login failed');
          console.warn('Facebook login error:', err);
        }
        throw err;
      })
    );
  }

  handleSocialLogin(credential: UserCredential): void {
    // Note: This is called after popup success, so loading is already true
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
            // Stop loading for the specific provider
            this.isGoogleLoading = false;
            this.isFacebookLoading = false;
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
            // Stop loading for the specific provider
            this.isGoogleLoading = false;
            this.isFacebookLoading = false;
            console.warn('Backend error:', err); // Debug
            this.toastr.error('Login failed: ' + (err.message || 'Unknown error'));
          }
        });
      } else {
        // Stop if no user
        this.isGoogleLoading = false;  
        this.isFacebookLoading = false;
      }
    });
  }

  uploadCV(file: File, filename: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);  // Send to backend

    return this.http.post(`${this.apiService.apiUrl}/upload_cv.php`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteCV(): Observable<any> {
    return this.http.post(`${this.apiService.apiUrl}/delete_cv.php`, {});
  }

  getPhotoURL(): string {
    return localStorage.getItem('photoURL') || '';
  }

  // Add signOut if needed
  firebaseSignOut() {
    this.auth.signOut().then(() => this.logout());  // Chain to your PHP logout
  }

}