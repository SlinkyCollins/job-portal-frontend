import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor
  (
    public router:Router,
    public http:HttpClient,
    public toastr: ToastrService
  ){}

  public password:string = '';
  public email:string = '';
  public showPassword:boolean = false;
  public msg:string = '';

clearPassword() {
    this.password = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    let userDetails = {
      mail: this.email,
      pword: this.password
    }
    this.http.post("http://localhost/JobPortal/login.php", userDetails).subscribe((data:any)=>{
      console.log(data);
      this.msg = data.msg;
      if (data.status == true) {
        this.toastr.success('Login successful');  
        // this.router.navigate(['/']);
      } else if (data.status == '401') {
        this.toastr.error('Incorrect password');  
      } else if (data.status = '404') {
        this.toastr.error('User not found, please try signing up');  
      }
    }, (error:any)=>{
      console.log(error);
      console.log('Error Response:', error.error);
    })
  }
}
