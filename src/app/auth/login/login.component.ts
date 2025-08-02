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

    this.http.post('https://jobnet.infinityfreeapp.com/login.php', credentials, {
      withCredentials: true  // Key to send cookies (PHP session)
    }).subscribe((response: any) => {
      this.loading = false;
      console.log(response);
      if (response.status) {
        localStorage.setItem('userId', response.user.id);
        this.toastr.success('Login successful');
        const role = response.user.role;
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
    });
  }
}
