import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-employer-dashboard',
    imports: [],
    templateUrl: './employer-dashboard.component.html',
    styleUrl: './employer-dashboard.component.css'
})
export class EmployerDashboardComponent {
  constructor(
    public http: HttpClient,
    public router: Router,
    public authService: AuthService,
    public toastr: ToastrService,
  ) { }

  public user: any = '';

  ngOnInit():void {
    this.authService.getEmployerData().subscribe((response: any) => {
      if (response.status) {
        this.user = response.user;
      }
    }, (err: any) => {
      console.error('Error fetching session:', err.status, err.message);

      if (err.status == 401) {
        this.toastr.warning(
          'Your session has expired. Please log in again.',
          'Session Timeout'
        );
      } else if (err.status == 403) {
        this.toastr.error(
          'You do not have permission to access this page.',
          'Access Denied'
        );
      } else if (err.status == 404) {
        this.toastr.info(
          'We could not find your user data. Please contact support.',
          'User Not Found'
        );
      } else if (err.status == 500) {
        this.toastr.error(
          'Something went wrong on our end. Please try again later.',
          'Server Error'
        );
      } else {
        this.toastr.error(
          'An unexpected error occurred. Please log in again.',
          'Error'
        );
      }

      // Clear user session and redirect after error
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      this.router.navigate(['/login']);
    })
  }


  logOut() {
    localStorage.removeItem('role');
    this.authService.firebaseSignOut();
    this.router.navigate(['/login']);
  }
}
