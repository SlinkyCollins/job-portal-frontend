import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seeker-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seeker-dashboard.component.html',
  styleUrl: './seeker-dashboard.component.css'
})
export class SeekerDashboardComponent {
  constructor(
    public router: Router,
    public toastr: ToastrService,
    public authService: AuthService,
  ) { }

  public applications: any[] = [];
  public user: any = '';

  ngOnInit() {
    this.authService.getUserSession().subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == true) {
          this.user = response.user;
          this.authService.setUser(response.user.user_id);
        }
      },
      (err: any) => {
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
        localStorage.removeItem('userId');
        this.router.navigate(['/login']);
      }
    );
  }

  logOut() {
    this.authService.logout();
  }
}
