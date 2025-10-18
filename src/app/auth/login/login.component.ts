import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ApiServiceService } from '../../core/services/api-service.service';
import { NavbarComponent } from '../../components/sections/navbar/navbar.component';
import { FooterComponent } from '../../components/sections/footer/footer.component';


@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule, NavbarComponent, FooterComponent],
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
  public email: string = localStorage.getItem('user') || '';
  public showPassword: boolean = false;
  public loading: boolean = false;
  public isRememberMe: boolean = true;


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

    this.http.post(`${this.apiService.apiUrl}/login.php`, credentials).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.status) {
          const role = response.user.role;
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.user.role);
          if (this.isRememberMe) {
            localStorage.setItem('user', response.user.email);
          } else {
            localStorage.removeItem('user');
          }
          this.toastr.success('Login successful');
          const routes: { [key: string]: string } = {
            admin: 'dashboard/admin',
            employer: 'dashboard/employer',
            job_seeker: 'dashboard/jobseeker'
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
      }
    );
  }


  googleLogin() {
    this.loading = true;
    this.authService.signInWithGoogle().subscribe({
      next: (credential) => {
        this.loading = false;
        this.authService.handleSocialLogin(credential)
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Google login failed');
        console.error(err);
      }
    });
  }

  facebookLogin() {
    this.loading = true;
    this.authService.signInWithFacebook().subscribe({
      next: (credential) => {
        this.loading = false;
        this.authService.handleSocialLogin(credential)
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Facebook login failed');
        console.error(err);
      }
    });
  }
}
