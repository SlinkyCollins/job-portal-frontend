import { Component } from '@angular/core';
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-settings',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
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

    // Pass both current and new password
    this.adminService.updatePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success('Password updated successfully');
          // Clear form
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.toastr.error(res.message || 'Failed to update password');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating password:', err);
        this.toastr.error(err.error?.message || 'Error updating password');
        this.isLoading = false;
      }
    });
  }

}
