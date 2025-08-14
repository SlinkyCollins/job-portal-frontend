import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../core/services/api-service.service';

@Component({
    selector: 'app-signup',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor
    (
      public router: Router,
      public http: HttpClient,
      public toastr: ToastrService,
      public apiService: ApiServiceService
    ) { }

  public firstname: string = '';
  public lastname: string = '';
  public email: string = '';
  public password: string = '';
  public role: string = '';
  public showPassword: boolean = false;
  public loading:boolean = false;
  public termsAccepted: boolean = false;


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
      this.http.post(`${this.apiService.apiUrl}/signup.php`, userObj, { withCredentials: true }).subscribe((response: any) => {
        console.log(response);
        this.loading = false;
        if (response.status) {
          this.toastr.success('Signed up successfully');
          this.router.navigate(['/login']);
        }
        form.resetForm();
      }, (error: any) => {
        this.loading = false;
        if (error.status === 403) {
          this.toastr.info('Email already exists');
        } else if (error.status === 500) {
          this.toastr.error('Server error. Please try again.');
        } else {
          this.toastr.error('Signup failed. Please try again.');
        }
        console.error('Signup Error:', error);
      })
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
