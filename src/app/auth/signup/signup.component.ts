import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor
  (
    public router:Router,
    public http:HttpClient,
    public toastr: ToastrService
  ){}

  public firstname = '';
  public lastname = '';
  public email = '';
  public password = '';
  public role = '';
  public showPassword = false;
  public msg = '';


  signup(form: NgForm){
    let userObj = {
      fname: this.firstname,
      lname: this.lastname,
      mail: this.email,
      pword: this.password,
      role: this.role
    }
    this.http.post('http://localhost/JobPortal/signup.php', userObj).subscribe((data:any)=>{
      console.log(data);
      this.msg = data.msg;
      if (data.status == '403') {
        this.toastr.info('Email already exists');  
      }
      if (data.status == true) {
        this.toastr.success('Signed up sucessfully');  
        this.router.navigate(['/login']);
      }
      form.resetForm();
    }, (error:any)=>{
      console.log(error);
      console.log('Error Response:', error.error);
      this.toastr.error('Signup failed. Please try again.');  // Display error toast
    })
    
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // clearPassword() {
  //   this.password = '';
  // }
}
