import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../components/sections/navbar/navbar.component';
import { FooterComponent } from '../../components/sections/footer/footer.component';

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
      public toastr: ToastrService
    ) { }

  public firstname: string = '';
  public lastname: string = '';
  public email: string = '';
  public password: string = '';
  public role: string = '';
  public showPassword: boolean = false;
  public loading:boolean = false;


  signup(form: NgForm) {
      this.loading = true;
      let userObj = {
        fname: this.firstname,
        lname: this.lastname,
        mail: this.email,
        pword: this.password,
        role: this.role
      }
      this.http.post('https://jobnet.infinityfreeapp.com/signup.php', userObj).subscribe((response: any) => {
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
