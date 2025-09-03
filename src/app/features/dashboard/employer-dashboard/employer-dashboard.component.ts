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

  ngOnInit(): void {
    this.authService.getEmployerData().subscribe((response: any) => {
      if (response.status) {
        this.user = response.user;
      }
    }, (err: any) => {
      console.error('Error fetching user data:', err.status, err.message);
      let errorMsg = 'An unexpected error occurred. Please log in again.';
      if (err.status === 401) {
        errorMsg = 'Your token has expired. Please log in again.';
        this.toastr.warning(errorMsg, 'Token Timeout');
      } else if (err.status === 403) {
        errorMsg = 'You do not have permission to access this page.';
        this.toastr.error(errorMsg, 'Access Denied');
      } else if (err.status === 404) {
        errorMsg = 'We could not find your user data. Please contact support.';
        this.toastr.info(errorMsg, 'User Not Found');
      } else if (err.status === 500) {
        errorMsg = 'Something went wrong on our end. Please try again later.';
        this.toastr.error(errorMsg, 'Server Error');
      } else {
        this.toastr.error(errorMsg, 'Error');
      }

      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      this.router.navigate(['/login']);
    });
  }


  logOut() {
    this.authService.firebaseSignOut();
    this.router.navigate(['/login']);
  }
}
