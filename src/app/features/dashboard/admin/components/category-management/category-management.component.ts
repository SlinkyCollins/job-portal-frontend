import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import this!
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: any[] = [];
  newCategoryName: string = '';
  isLoading = false;

  constructor(private adminService: AdminService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.adminService.getAllCategories().subscribe({
      next: (res: any) => {
        if (res.status) this.categories = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    this.adminService.createCategory(this.newCategoryName).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success('Category added');
          this.newCategoryName = ''; // Clear input
          this.loadCategories();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to add')
    });
  }

  deleteCategory(id: number) {
    if (confirm('Delete this category? Jobs using it will be unassigned.')) {
      this.adminService.deleteCategory(id).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Category deleted');
            this.loadCategories();
          }
        },
        error: () => this.toastr.error('Failed to delete')
      });
    }
  }
}