import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { InitialsPipe } from '../../../../../core/pipes/initials.pipe';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, InitialsPipe],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = true;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.users = res.data;
        } else {
          this.toastr.error(res.message || 'Failed to load users');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error loading users');
        this.isLoading = false;
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.toastr.success('User deleted successfully');
            this.loadUsers();
          } else {
            this.toastr.error(res.message || 'Failed to delete user');
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error deleting user');
        }
      });
    }
  }
}
