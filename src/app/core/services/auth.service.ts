import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from './api-service.service';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, UserCredential } from '@angular/fire/auth';
import { catchError, from, Observable, switchMap } from 'rxjs';
export const API = {
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  APPLY: 'jobs/apply',
  CHANGEPASSWORD: 'dashboard/change_password',
  VERIFYOLDPASSWORD: 'dashboard/verify_old_password',
  USERDATA: 'dashboard/user_data',
  SEEKERDATA: 'dashboard/seeker_dashboard',
  EMPLOYERDATA: 'dashboard/employer_dashboard',
  ADMINDATA: 'dashboard/admin_dashboard',
  UPDATEACCOUNT: 'dashboard/update_account',
  UPDATERESUME: 'dashboard/update_resume',
  ALLJOBS: 'jobs/all_jobs',
  SAVEDJOBS: 'dashboard/saved_jobs',
  JOBDETAILS: (jobId: number) => `jobs/${jobId}`,
  SEEKERPROFILE: 'seekers/profile',
  WISHLIST: 'jobs/wishlist',
  WISHLIST_DELETE: 'jobs/wishlist_delete',
  UPLOAD_CV: 'seekers/upload_cv',
  DELETE_CV: 'seekers/delete_cv',
  SOCIAL_LOGIN: 'auth/social_login'
};


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

  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }

  logout() {
    this.http.post(this.fullUrl(API.LOGOUT), {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.toastr.success('Logged out');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
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
    return this.http.get(this.fullUrl(API.USERDATA));
  }

  getSeekerData() {
    return this.http.get(this.fullUrl(API.SEEKERDATA));
  }

  getEmployerData() {
    return this.http.get(this.fullUrl(API.EMPLOYERDATA));
  }

  getAllJobs() {
    return this.http.get(this.fullUrl(API.ALLJOBS));
  }

  getSavedJobs(params: any = {}) {
    return this.http.get(this.fullUrl(API.SAVEDJOBS), { params });
  }

  getJobDetails(jobId: number) {
    return this.http.get(this.fullUrl(API.JOBDETAILS(jobId)));
  }

  getSeekerProfile() {
    return this.http.get(this.fullUrl(API.SEEKERPROFILE));
  }

  updateAccountSettings(data: any) {
    return this.http.post(this.fullUrl(API.UPDATEACCOUNT), data);
  }

  applyToJob(jobId: number) {
    return this.http.post(this.fullUrl(API.APPLY), { jobId });
  }

  addToWishlist(jobId: number) {
    return this.http.post(this.fullUrl(API.WISHLIST), { jobId });
  }

  removeFromWishlist(jobId: number) {
    return this.http.post(this.fullUrl(API.WISHLIST_DELETE), { jobId });
  }

  verifyOldPassword(oldPassword: string): Observable<any> {
    return this.http.post(this.fullUrl(API.VERIFYOLDPASSWORD), { oldPassword });
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post(this.fullUrl(API.CHANGEPASSWORD), {
      oldPassword,
      newPassword
    });
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
            this.toastr.success(`${job.title} removed from saved jobs.`);
          } else {
            this.toastr.error(res.msg);
          }
          job.isSaving = false;
        },
        error: () => {
          this.toastr.error(`Error removing ${job.title} from saved jobs.`);
          job.isSaving = false;
        },
      });
    } else {
      this.addToWishlist(job.job_id).subscribe({
        next: (res: any) => {
          if (res.status) {
            job.isSaved = true;
            this.toastr.success(`${job.title} saved!`);
          } else {
            this.toastr.error(res.msg);
          }
          job.isSaving = false;
        },
        error: () => {
          this.toastr.error(`Error saving ${job.title}.`);
          job.isSaving = false;
        },
      });
    }
  }

  signInWithGoogle(): Observable<UserCredential> {
    if (this.isLoggedIn()) {
      this.toastr.warning('Please log out before using Google login.');
      throw new Error('User already logged in');
    }
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
    // Detect mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      this.toastr.warning('Facebook login is not supported on mobile devices. Please use Google or email/password.');
      throw new Error('Facebook login disabled on mobile');
    }
    if (this.isLoggedIn()) {
      this.toastr.warning('Please log out before using Facebook login.');
      throw new Error('User already logged in');
    }
    this.isFacebookLoading = true;
    console.log('Attempting Facebook login with popup');  // Add logging
    return from(this.ngZone.run(() => signInWithPopup(this.auth, new FacebookAuthProvider()))).pipe(
      catchError(err => {
        this.isFacebookLoading = false;
        console.error('Facebook popup error:', err);  // Enhanced logging
        if (err.code === 'auth/popup-blocked') {
          this.toastr.error('Popup blocked by browser. Please allow popups for this site and try again.');
        } else if (err.code === 'auth/account-exists-with-different-credential') {
          this.toastr.warning('An account with this email already exists. Please log in with Google first, then link Facebook in your profile settings.');
        } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          this.toastr.error('Login cancelled. Try again.');
        } else {
          this.toastr.error('Facebook login failed. Please check your connection.');
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
        from(user.getIdToken()).pipe(
          switchMap(token => {
            return this.http.post(this.fullUrl(API.SOCIAL_LOGIN), { token, photoURL: user.photoURL || '' });
          })
        ).subscribe({
          next: (response: any) => {
            // Stop loading for the specific provider
            const providerId = credential.user.providerData[0]?.providerId;  // Get the provider ID
            if (providerId === 'google.com') {
              this.isGoogleLoading = false;
            } else if (providerId === 'facebook.com') {
              this.isFacebookLoading = false;
            }
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
            const providerId = credential.user.providerData[0]?.providerId;  // Get the provider ID
            if (providerId === 'google.com') {
              this.isGoogleLoading = false;
            } else if (providerId === 'facebook.com') {
              this.isFacebookLoading = false;
            }
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

    return this.http.post(this.fullUrl(API.UPLOAD_CV), formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteCV(): Observable<any> {
    return this.http.post(this.fullUrl(API.DELETE_CV), {});
  }

  updateResume(data: any): Observable<any> {
    return this.http.post(this.fullUrl(API.UPDATERESUME), data);
  }

  // Add signOut if needed
  firebaseSignOut() {
    this.auth.signOut().then(() => this.logout());  // Chain to your PHP logout
  }

}
