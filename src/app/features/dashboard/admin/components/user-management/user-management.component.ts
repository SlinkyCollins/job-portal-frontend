import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { InitialsPipe } from '../../../../../core/pipes/initials.pipe';
import { finalize } from 'rxjs/operators';

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
  showDeleteConfirm: boolean = false;
  userToDelete: number | null = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        if (res.status) {
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

  showDeleteModal(userId: number) {
    this.userToDelete = userId;
    this.showDeleteConfirm = true;
    // Prevent body scroll when modal is open
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  hideDeleteModal() {
    this.showDeleteConfirm = false;
    this.userToDelete = null;
    // Restore body scroll
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  confirmDelete() {
    if (this.userToDelete !== null) {
      this.adminService.deleteUser(this.userToDelete).pipe(
        finalize(() => this.hideDeleteModal())
      ).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('User deleted successfully');
            this.loadUsers();
          } else {
            this.toastr.error(res.message || 'Failed to delete user');
          }
        },
        error: (err) => {
          console.error(err);
          // The backend response body is inside err.error
          const serverMessage = err.error?.message;
          
          if (serverMessage === 'Cannot delete other admins') {
            this.toastr.error('You cannot delete other admins.');
          } else if (serverMessage) {
            // Show any other specific error from backend
            this.toastr.error(serverMessage);
          } else {
            this.toastr.error('Error deleting user');
          }
        }
      });
    }
  }

  deleteUser(userId: number) {
    this.showDeleteModal(userId);
  }
}
