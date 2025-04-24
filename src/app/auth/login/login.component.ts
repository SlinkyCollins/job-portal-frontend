import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ApiServiceService } from '../../core/services/api-service.service';

@Component({
    selector: 'app-login',
    imports: [RouterLink, CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor
    (
      public router: Router,
      public http: HttpClient,
      public toastr: ToastrService,
      public authService: AuthService,
      public apiService: ApiServiceService
    ) { }

  public password: string = '';
  public email: string = '';
  public showPassword: boolean = false;
  public loading: boolean = false;

  clearPassword() {
    this.password = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.loading = true;
    let credentials = {
      mail: this.email,
      pword: this.password
    }

    this.http.post('http://localhost/JobPortal/login.php', credentials, {
      withCredentials: true  // Key to send cookies (PHP session)
    }).subscribe((response: any) => {
      this.loading = false;
      console.log(response);
      if (response.status) {
        localStorage.setItem('userId', response.user.id);
        this.toastr.success('Login successful');
        const role = response.user.role;
        const routes: { [key: string]: string } = {
          admin: '/admin/dashboard',
          employer: '/employer/dashboard',
          job_seeker: '/jobseeker/dashboard'
        };
        this.router.navigate([routes[role] || '/']);
      }
    }, (error: any) => {
      this.loading = false;
      if (error.status === 401) {
        this.toastr.error('Incorrect email or password');
      } else if (error.status === 404) {
        this.toastr.error('User not found, please try signing up');
      } else {
        console.log(error.msg);
        this.toastr.error('Login failed. Please try again.');
      }
      console.error(error);
      console.log('Error Response:', error.error);
    });
  }
}
