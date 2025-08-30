import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, RESPONSE_INIT } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from './api-service.service';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
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
    private firestore: Firestore,  // For storing user data
    private ngZone: NgZone
  ) { }

  // setUser(userId: any) {
  //   localStorage.setItem('userId', JSON.stringify(userId));
  // }

  // getUser() {
  //   return JSON.parse(localStorage.getItem('userId')!);
  // }

  logout() {
    this.http.post(`${this.apiService.apiUrl}/logout.php`, {}, { withCredentials: true }).subscribe(
      (response: any) => {
        if (response.status) {
          this.toastr.success('Logged out');
          localStorage.removeItem('userId');
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

  getUserData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/user_data.php`, {
      withCredentials: true
    });
  }

  getSeekerData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/seeker_dashboard.php`, {
      withCredentials: true
    });
  }

  getEmployerData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/employer_dashboard.php`, {
      withCredentials: true
    });
  }

  getAllJobs() {
    return this.http.get(`${this.apiService.apiUrl}/jobs.php`, { withCredentials: true });
  }

  getJobDetails(jobId: number) {
    return this.http.get(`${this.apiService.apiUrl}/jobdetails.php?id=${jobId}`, { withCredentials: true });
  }

  applyToJob(jobId: number) {
    return this.http.post(`${this.apiService.apiUrl}/apply.php`, { jobId }, { withCredentials: true });
  }

  addToWishlist(jobId: number) {
    return this.http.post(`${this.apiService.apiUrl}/wishlist.php`, { jobId }, { withCredentials: true });
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
        const userDoc = doc(this.firestore, `users/${user.uid}`);
        setDoc(userDoc, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date()
        }, { merge: true }).catch(err => console.error('Firestore error:', err));

        from(user.getIdToken()).pipe(
          switchMap(token => {
            return this.http.post(`${this.apiService.apiUrl}/social_login.php`, { token }, { withCredentials: true });
          })
        ).subscribe({
          next: (response: any) => {
            if (response.status) {
              this.toastr.success('Login successful');
              localStorage.setItem('role', response.user.role);
              this.router.navigate([response.user.role === 'job_seeker' ? '/dashboard/jobseeker' : (response.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/admin')]);
            } else if (response.newUser) {
              this.router.navigate(['/role-select'], { state: { uid: user.uid, token: response.token } });
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

  // Add signOut if needed
  firebaseSignOut() {
    this.auth.signOut().then(() => this.logout());  // Chain to your PHP logout
  }

}