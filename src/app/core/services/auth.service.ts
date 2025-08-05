import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    public http: HttpClient,
    public router: Router,
    public toastr: ToastrService,
    public apiService: ApiServiceService
  ) {}

  setUser(user: any) {
    localStorage.setItem('userId', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('userId')!);
  }

  logout() {
    this.http.post(`${this.apiService.apiUrl}/logout.php`, {}, { withCredentials: true }).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status) {
          this.toastr.success('Logged out');
          localStorage.removeItem('userId');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error('Logout failed');
        }
      },
      err => {
        this.toastr.error('Logout failed');
        console.log('Logout error:', err);
      }
    );
  }

  getUserSession() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/user_session.php`, {
      withCredentials: true
    });
  }
  
  getSeekerData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/seeker_dashboard.php`, {
      withCredentials: true
    }); 
  }
  
  getEmployerData() {
    return this.http.get(`${this.apiService.apiUrl}/dashboard/employer_dashboard.php`, {
      withCredentials: true
    });
  }

}