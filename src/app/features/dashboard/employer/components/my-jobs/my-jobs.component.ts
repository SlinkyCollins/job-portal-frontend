import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { AppModalComponent } from '../../../../../shared/ui/app-modal/app-modal.component';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, AppModalComponent],
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  jobs: any[] = [];
  isLoading = true;
  showDeleteModal = false;
  jobToDelete: number | null = null;
  isDeleting = false;
  showCloseModal = false;
  jobToClose: number | null = null;
  isClosing = false;

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = 10;
  totalJobs: number = 0;
  totalAllJobs: number = 0;

  // Sorting
  selectedSort: string = 'all';

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(params: any = {}) {
    this.isLoading = true;
    const defaultParams = {
      page: this.currentPage,
      per_page: this.perPage,
      sort: this.selectedSort
    };
    const queryParams = { ...defaultParams, ...params };

    this.dashboardService.getEmployerJobs(queryParams).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.jobs = res.data;
          this.totalJobs = res.total;  // Filtered total
          this.totalAllJobs = res.total_all; // Total without filters
          this.totalPages = res.total_pages;
          this.currentPage = res.page;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading jobs', err);
        this.isLoading = false;
      }
    });
  }

  onSortChange() {
    this.currentPage = 1; // Reset to first page when sorting
    this.loadJobs();
  }


  closeJob(jobId: number) {
    this.jobToClose = jobId;
    this.showCloseModal = true;
  }

  confirmClose(): void {
    if (this.jobToClose) {
      this.isClosing = true;
      this.dashboardService.closeJob(this.jobToClose).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Job closed successfully');
            this.loadJobs();
          } else {
            this.toastr.error(res.message || 'Failed to close job');
          }
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'An error occurred while closing the job');
        },
        complete: () => {
          this.isClosing = false;
          this.showCloseModal = false;
          this.jobToClose = null;
        }
      });
    }
  }

  cancelClose(): void {
    this.showCloseModal = false;
    this.jobToClose = null;
  }

  deleteJob(jobId: number) {
    this.jobToDelete = jobId;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.jobToDelete) {
      this.isDeleting = true;
      this.dashboardService.deleteJob(this.jobToDelete).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Job deleted successfully');
            this.loadJobs(); // Reload current page
          } else {
            this.toastr.error(res.message || 'Failed to delete job');
          }
        },
        error: (err) => {
          this.toastr.error('An error occurred while deleting');
          console.error(err);
        },
        complete: () => {
          this.isDeleting = false;
          this.showDeleteModal = false;
          this.jobToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.jobToDelete = null;
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobs();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadJobs();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadJobs();
    }
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getShowingText(): string {
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalJobs);
    return `Showing ${start} to ${end} of ${this.totalJobs} jobs`;
  }
}