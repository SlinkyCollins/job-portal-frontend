import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from '../core/services/api-service.service';
import { CommonModule } from '@angular/common';
export const API = {
  SAVE_ROLE: 'auth/save_role'
};

@Component({
  selector: 'app-role-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-select.component.html',
  styleUrls: ['./role-select.component.css']
})
export class RoleSelectComponent {
  role: string = '';
  termsAccepted: boolean = false;
  isSubmitting: boolean = false;
  private token: string = history.state.token;  // From router state
  private uid: string = history.state.uid;
  private photoURL: string = history.state.photoURL || '';

  constructor(
    private http: HttpClient,
    private apiService: ApiServiceService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }

  submitRole() {
    if (!this.token || !this.uid) {
      this.toastr.error('Missing token or user ID');
      this.router.navigate(['/signup']);
      return;
    };

    if (!this.termsAccepted) {
      this.toastr.error('You must accept the Terms and Conditions');
      return;
    }

    if (this.role) {
      this.isSubmitting = true;
      this.http.post(this.fullUrl(API.SAVE_ROLE), { 
        token: this.token, 
        role: this.role, 
        photoURL: this.photoURL,
        termsAccepted: this.termsAccepted 
      }).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.isSubmitting = false;
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', this.role);
            this.toastr.success('Role selected');
            this.router.navigate([`/dashboard/${this.role.replace('_', '')}`]);
          } else {
            this.isSubmitting = false;
            this.toastr.error(response.msg || 'Role save failed');
          }
        },
        error: (err: any) => {
          this.isSubmitting = false;
          console.error('Save role error:', err);
          this.toastr.error(err.error?.msg || 'Role save failed');
        }
      });
    }
  }
}