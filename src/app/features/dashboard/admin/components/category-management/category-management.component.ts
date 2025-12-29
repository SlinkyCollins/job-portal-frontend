import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  newCategoryName: string = '';
  isLoading = false;
  isAdding = false;

  showEditModal = false;
  editCategoryName = '';
  editingCategory: any = null;

  // Modal State
  showDeleteConfirm: boolean = false;
  categoryToDelete: number | null = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  loadCategories() {
    this.isLoading = true;
    this.adminService.getAllCategories().subscribe({
      next: (res: any) => {
        if (res.status) {
          // Ensure job_count is a number for proper class binding
          this.categories = res.data.map((cat: any) => ({
            ...cat,
            job_count: parseInt(cat.job_count, 10) || 0
          }));
        } else {
          this.toastr.error('Failed to load categories');
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    this.isAdding = true;
    this.adminService.createCategory(this.newCategoryName).pipe(
      finalize(() => this.isAdding = false)
    ).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success('Category added successfully');
          this.newCategoryName = ''; // Clear input
          this.loadCategories();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => this.toastr.error(err.error?.message || 'Failed to add category')
    });
  }

  // --- Delete Logic ---
  showDeleteModal(id: number) {
    this.categoryToDelete = id;
    this.showDeleteConfirm = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  hideDeleteModal() {
    this.showDeleteConfirm = false;
    this.categoryToDelete = null;
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  confirmDelete() {
    if (this.categoryToDelete !== null) {
      this.adminService.deleteCategory(this.categoryToDelete).pipe(
        finalize(() => this.hideDeleteModal())
      ).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Category deleted');
            // Optimistic update
            this.categories = this.categories.filter(c => c.id !== this.categoryToDelete);
          } else {
            this.toastr.error(res.message);
          }
        },
        error: () => this.toastr.error('Failed to delete category')
      });
    }
  }

  deleteCategory(id: number) {
    this.showDeleteModal(id);
  }

  editCategory(cat: any) {
    this.editingCategory = cat;
    this.editCategoryName = cat.name;
    this.showEditModal = true;
  }

  hideEditModal() {
    this.showEditModal = false;
    this.editCategoryName = '';
    this.editingCategory = null;
  }

  confirmEdit() {
    if (!this.editCategoryName.trim()) return;

    this.adminService.updateCategory(this.editingCategory.id, this.editCategoryName.trim()).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success('Category updated successfully');
          this.loadCategories();
          this.hideEditModal();
        } else {
          this.toastr.error(res.message || 'Update failed');
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error updating category');
      }
    });
  }
}