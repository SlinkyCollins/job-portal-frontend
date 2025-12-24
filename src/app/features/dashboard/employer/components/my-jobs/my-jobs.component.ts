import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  jobs: any[] = [];
  isLoading = true;

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

  deleteJob(jobId: number) {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {

      this.dashboardService.deleteJob(jobId).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Job deleted successfully');
            // Reload current page
            this.loadJobs();
          } else {
            this.toastr.error(res.message || 'Failed to delete job');
          }
        },
        error: (err) => {
          this.toastr.error('An error occurred while deleting');
          console.error(err);
        }
      });
    }
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