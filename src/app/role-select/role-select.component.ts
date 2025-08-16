import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from '../core/services/api-service.service';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2>Select Your Role</h2>
      <select [(ngModel)]="role">
        <option value="">Select a Role</option>
        <option value="job_seeker">Job Seeker</option>
        <option value="employer">Employer</option>
      </select>
      <button (click)="submitRole()" [disabled]="!role">Submit</button>
    </div>
  `,
  // templateUrl: './role-select.component.html',
  // styleUrl: './role-select.component.css'
})
export class RoleSelectComponent {
  role: string = '';
  private token: string = history.state.token;  // From router state
  private uid: string = history.state.uid;

  constructor(
    private http: HttpClient,
    private apiService: ApiServiceService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  submitRole() {
    this.http.post(`${this.apiService.apiUrl}/save_role.php`, { token: this.token, role: this.role }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.authService.setUser(response.user.id);
          this.toastr.success('Role selected');
          this.router.navigate([`/dashboard/${this.role.replace('_', '')}`]);
        }
      },
      error: () => this.toastr.error('Role save failed')
    });
  }
}