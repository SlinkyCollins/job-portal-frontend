import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
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
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: any[] = [];
  isLoading: boolean = true;

  // Pagination State
  currentPage: number = 1;
  pageSize: number = 10;

  // Modal State
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

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.users = res.data;
          // Reset to page 1 on new data load
          this.currentPage = 1;
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

  toggleSuspend(user: any) {
    const action = user.suspended ? 'unsuspend' : 'suspend';
    const message = action === 'suspend' ? 'suspended' : 'unsuspended';
    this.adminService.toggleUserSuspension(user.user_id, action).subscribe({
      next: (res: any) => {
        if (res.status) {
          user.suspended = !user.suspended;
          this.toastr.success(`User ${message} successfully`);
        } else {
          this.toastr.error(res.message || 'Action failed');
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error updating user status');
      }
    });
  }

  // --- Pagination Logic ---
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get totalPagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Optional: Scroll to top of table
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- Delete Logic ---
  showDeleteModal(userId: number) {
    this.userToDelete = userId;
    this.showDeleteConfirm = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  hideDeleteModal() {
    this.showDeleteConfirm = false;
    this.userToDelete = null;
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
            // Optimistic update: remove from local array instead of reloading API
            this.users = this.users.filter(u => u.user_id !== this.userToDelete);

            // Adjust page if empty
            if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
              this.currentPage--;
            }
          } else {
            this.toastr.error(res.message || 'Failed to delete user');
          }
        },
        error: (err) => {
          console.error(err);
          const serverMessage = err.error?.message;
          if (serverMessage === 'Cannot delete other admins') {
            this.toastr.error('You cannot delete other admins.');
          } else if (serverMessage) {
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