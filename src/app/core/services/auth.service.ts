import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from './api-service.service';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, linkWithPopup, UserCredential } from '@angular/fire/auth';
import { BehaviorSubject, catchError, from, Observable, switchMap, tap } from 'rxjs';
import { Location } from '@angular/common';
export const API = {
  // Auth Endpoints
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  SOCIAL_LOGIN: 'auth/social_login',

  // Jobs Endpoints
  APPLY: 'jobs/apply',
  ALLJOBS: 'jobs/all_jobs',
  WISHLIST: 'jobs/wishlist',
  WISHLIST_DELETE: 'jobs/wishlist_delete',
  JOBDETAILS: (jobId: number) => `jobs/${jobId}`,

  // Shared Endpoints
  CHANGEPASSWORD: 'dashboard/shared/change_password',
  VERIFYOLDPASSWORD: 'dashboard/shared/verify_old_password',
  USERDATA: 'dashboard/shared/user_data',
  UPDATEACCOUNT: 'dashboard/shared/update_account',

  // Seeker Endpoint
  SEEKERDATA: 'dashboard/seeker/seeker_dashboard',

  // Admin Endpoint
  ADMINDATA: 'dashboard/admin/admin_dashboard',

  // Employer Endpoint
  EMPLOYERDATA: 'dashboard/employer/employer_dashboard'
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
    private auth: Auth,
    private ngZone: NgZone,
    private location: Location
  ) { }

  // 1. Create a BehaviorSubject to hold the user state
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Fallback: Redirect based on their ACTUAL role
      const role = this.getUserRole();
      if (role === 'job_seeker') {
        this.router.navigate(['/dashboard/jobseeker']);
      } else if (role === 'employer') {
        this.router.navigate(['/dashboard/employer']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/']); // Home if no role
      }
    }
  }

  // Helper to redirect unauthorized users to their correct home
  redirectBasedOnRole(role: string) {
    this.toastr.warning('You do not have permission to view that page.', 'Access Denied');

    if (role === 'job_seeker') {
      this.router.navigate(['/dashboard/jobseeker']);
    } else if (role === 'employer') {
      this.router.navigate(['/dashboard/employer']);
    } else if (role === 'admin') {
      this.router.navigate(['/dashboard/admin']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.http.post(this.fullUrl(API.LOGOUT), {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.toastr.success('Logged out');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          // Reset social loading flags
          this.isGoogleLoading = false;
          this.isFacebookLoading = false;
          this.router.navigate(['/login']);
        } else {
          this.toastr.error('Logout failed');
        }
      },
      err => {
        this.toastr.error('Logout failed');
        // Reset social loading flags
        this.isGoogleLoading = false;
        this.isFacebookLoading = false;
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

  getAdminData() {
    return this.http.get(this.fullUrl(API.ADMINDATA));
  }

  // 2. Update getEmployerData to TAP into the response and save it
  getEmployerData(): Observable<any> {
    return this.http.get<any>(this.fullUrl(API.EMPLOYERDATA)).pipe(
      tap(response => {
        if (response.status && response.user) {
          // Save the user data to our state
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  // Helper to get current value without subscribing (optional)
  getCurrentUserValue() {
    return this.currentUserSubject.value;
  }

  getAllJobs() {
    return this.http.get(this.fullUrl(API.ALLJOBS));
  }



  getJobDetails(jobId: number) {
    return this.http.get(this.fullUrl(API.JOBDETAILS(jobId)));
  }

  updateAccountSettings(data: any) {
    return this.http.post(this.fullUrl(API.UPDATEACCOUNT), data);
  }

  applyToJobWithCV(formData: FormData): Observable<any> {
    return this.http.post(this.fullUrl(API.APPLY), formData);
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

  linkWithGoogle(): Observable<UserCredential> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    return from(this.ngZone.run(() => linkWithPopup(user, new GoogleAuthProvider())));
  }

  linkWithFacebook(): Observable<UserCredential> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    return from(this.ngZone.run(() => linkWithPopup(user, new FacebookAuthProvider())));
  }

  signInWithGoogle(isLinking: boolean = false): Observable<UserCredential> {
    if (!isLinking && this.isLoggedIn()) {
      this.toastr.warning('Please log out before using Google login.');
      throw new Error('User already logged in');
    }
    this.isGoogleLoading = true;
    return from(this.ngZone.run(() => signInWithPopup(this.auth, new GoogleAuthProvider()))).pipe(
      catchError(err => {
        this.isGoogleLoading = false;
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

  signInWithFacebook(isLinking: boolean = false): Observable<UserCredential> {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      this.toastr.warning('Facebook login is not supported on mobile devices. Please use Google or email/password.');
      throw new Error('Facebook login disabled on mobile');
    }
    if (!isLinking && this.isLoggedIn()) {
      this.toastr.warning('Please log out before using Facebook login.');
      throw new Error('User already logged in');
    }
    this.isFacebookLoading = true;
    console.log('Attempting Facebook login with popup');
    return from(this.ngZone.run(() => signInWithPopup(this.auth, new FacebookAuthProvider()))).pipe(
      catchError(err => {
        this.isFacebookLoading = false;
        console.error('Facebook popup error:', err);
        if (err.code === 'auth/popup-blocked') {
          this.toastr.error('Popup blocked by browser. Please allow popups for this site and try again.');
        } else if (err.code === 'auth/account-exists-with-different-credential') {
          this.toastr.warning('An account with this email already exists. Please log in with Google first, then link Facebook in your profile settings.');
        } else if (err.code === 'auth/credential-already-in-use' || err.errorMessage === 'FEDERATED_USER_ID_ALREADY_LINKED') {
          this.toastr.error('This Facebook account is already linked to another user.');
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

  // Add signOut if needed
  firebaseSignOut() {
    this.auth.signOut().then(() => this.logout());  // Chain to your PHP logout
  }

}
