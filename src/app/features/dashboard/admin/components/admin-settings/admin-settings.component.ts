import { Component } from '@angular/core';
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  // Visibility Toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  toggleVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.toastr.warning('Please fill in all fields');
      return;
    }

    if (this.newPassword.length < 6) {
      this.toastr.error('New password must be at least 6 characters long');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('New passwords do not match');
      return;
    }

    this.isLoading = true;

    this.adminService.updatePassword(this.currentPassword, this.newPassword)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Password updated successfully');
            this.resetForm();
          } else {
            this.toastr.error(res.message || 'Failed to update password');
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.error?.message || 'Error updating password');
        }
      });
  }

  resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
}