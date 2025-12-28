import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../core/services/api-service.service';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/sections/navbar/navbar.component';
import { FooterComponent } from '../../shared/sections/footer/footer.component';
export const API = {
  SIGNUP: 'auth/signup'
}

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor
    (
      public router: Router,
      public http: HttpClient,
      public toastr: ToastrService,
      public authService: AuthService,
      public apiService: ApiServiceService
    ) { }

  public firstname: string = '';
  public lastname: string = '';
  public email: string = '';
  public password: string = '';
  public role: string = '';
  public showPassword: boolean = false;
  public loading: boolean = false;
  public termsAccepted: boolean = false;

  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }


  signup(form: NgForm) {
    this.loading = true;
    let userObj = {
      fname: this.firstname,
      lname: this.lastname,
      mail: this.email,
      pword: this.password,
      role: this.role,
      terms: this.termsAccepted
    }
    this.http.post(this.fullUrl(API.SIGNUP), userObj, { withCredentials: true }).subscribe((response: any) => {
      this.loading = false;
      if (response.status) {
        this.toastr.success('Signed up successfully');
        this.router.navigate(['/login']);
      }
      form.resetForm();
    }, (err: any) => {
      this.loading = false;
      if (err.status === 403) {
        this.toastr.info(err.error.msg);
      } else if (err.status === 500) {
        this.toastr.error('Server error. Please try again.');
      } else {
        this.toastr.error('Signup failed. Please try again.');
      }
      console.error('Signup Error:', err);
    })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  googleLogin() {
    this.authService.signInWithGoogle().subscribe({
      next: (credential) => {
        this.authService.handleSocialLogin(credential);
      },
      error: (err) => {
        this.toastr.error('Google login failed');
        console.error(err);
      }
    });
  }

  facebookLogin() {
    this.authService.signInWithFacebook().subscribe({
      next: (credential) => {
        this.authService.handleSocialLogin(credential);
      },
      error: (err) => {
        this.toastr.error('Facebook login failed');
        console.error(err);
      }
    });
  }
}
