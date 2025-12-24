import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { ToastrService } from "ngx-toastr"
import { AuthService } from "../../../../../core/services/auth.service"
import { DashboardService } from "../../../../../core/services/dashboard.service"


interface SortOption {
  value: string
  label: string
}

@Component({
  selector: "app-saved-jobs",
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: "./saved-jobs.component.html",
  styleUrls: ["./saved-jobs.component.css"],
})
export class SavedJobsComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private dashboardService: DashboardService
  ) { }
  // Page Configuration
  pageTitle = "Saved Jobs"
  sortLabel = "Sort by"

  // Sort Options
  sortOptions: SortOption[] = [
    { value: "new", label: "New" },
    { value: "old", label: "Old" },
    { value: "salary-high", label: "Salary: High to Low" },
    { value: "salary-low", label: "Salary: Low to High" },
    { value: "company", label: "Company Name" },
    { value: "type", label: "Job Type" },
    { value: "category", label: "Category" }
  ]

  selectedSort: string = "new";

  // Saved Jobs Data
  savedJobs: any[] = [];
  isLoading = true;
  isRemoving = false;
  private jobToRemove: any = null;

  // Pagination (now backend-driven)
  currentPage: number = 1;
  perPage: number = 5; // Matches backend default
  totalPages: number = 0;
  totalJobs: number = 0;
  showEllipsis: boolean = true
  visiblePages: number[] = [1, 2, 3]

  ngOnInit(): void {
    this.loadSavedJobs();
  }

  loadSavedJobs(): void {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      per_page: this.perPage,
      sort: this.selectedSort
    };
    this.dashboardService.getSavedJobs(params).subscribe({
      next: (response: any) => {
        if (response.status && response.savedJobs) {
          this.savedJobs = response.savedJobs.map((job: any) => ({
            id: job.saved_id,
            job_id: job.job_id,
            title: job.title,
            companyName: job.company_name,
            companyLogo: job.company_logo,
            type: job.employment_type,
            salary: job.salary_amount,
            currency: job.currency,
            salaryPeriod: job.salary_duration,
            experienceLevel: job.experience_level,
            location: job.location,
            tags: job.tags,
            timeSaved: this.formatTimeSaved(job.saved_at)
          }));
          // Update pagination from backend
          this.totalJobs = response.pagination.total_jobs;
          this.totalPages = response.pagination.total_pages;
          this.updateVisiblePages();
        } else {
          this.savedJobs = [];
          this.toastr.warning('No saved jobs found.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading saved jobs:', err);
        this.toastr.error('Failed to load saved jobs. Please try again.');
        this.isLoading = false;
      }
    });
  }

  onSortChange(): void {
    this.currentPage = 1; // Reset to first page on sort
    this.loadSavedJobs();
  }

  // Methods
  getJobTypeClass(type: string): string {
    switch (type) {
      case "fulltime":
        return "job-type-fulltime"
      case "parttime":
        return "job-type-parttime"
      case "remote":
        return "job-type-remote"
      case "contract":
        return "job-type-contract"
      default:
        return "job-type-default"
    }
  }

  onJobAction(action: string, job: any): void {
    console.log(`${action} action for job:`, job.title)

    switch (action) {
      case "view":
        this.router.navigate(['/jobdetails', job.job_id]);
        break
      case "share":
        this.shareJob(job);
        break
      case "apply":
        this.router.navigate(['/jobdetails', job.job_id]);
        break
      case "remove":
        this.jobToRemove = job;
        // Open modal
        const modal = new (window as any).bootstrap.Modal(document.getElementById('removeModal'));
        modal.show();
        break
    }
  }

  confirmRemove(): void {
    if (!this.jobToRemove) return;
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('removeModal'));
    modal.hide();
    this.removeJob(this.jobToRemove.job_id);
    this.jobToRemove = null;
  }

  removeJob(savedId: number): void {
    const job = this.savedJobs.find(j => j.job_id === savedId);
    if (!job || this.isRemoving) return;
    this.isRemoving = true;
    this.authService.removeFromWishlist(job.job_id).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.savedJobs = this.savedJobs.filter((j) => j.job_id !== savedId);
          this.toastr.success('Job removed from saved jobs.');
          this.totalJobs--;
          // Recalculate totalPages
          this.totalPages = Math.ceil(this.totalJobs / this.perPage);

          // If current page is now empty and not the first page, go back one page
          if (this.savedJobs.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.loadSavedJobs();
          } else {
            this.updateVisiblePages();
          }
        } else {
          this.toastr.error(response.msg || 'Failed to remove job.');
        }
        this.isRemoving = false;
      },
      error: (err) => {
        console.error('Error removing job:', err);
        this.toastr.error('Failed to remove job. Please try again.');
        this.isRemoving = false;
      }
    });
  }

  private formatTimeSaved(savedAt: string): string {
    const date = new Date(savedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  private shareJob(job: any): void {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.companyName}`,
        url: window.location.origin + '/jobdetails/' + job.job_id
      });
    } else {
      // Fallback: copy to clipboard
      const url = window.location.origin + '/jobdetails/' + job.job_id;
      navigator.clipboard.writeText(url).then(() => {
        this.toastr.success('Job link copied to clipboard!');
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadSavedJobs(); // Reload with new page
      this.updateVisiblePages();
    }
  }

  private updateVisiblePages(): void {
    const pages: number[] = []
    const start = Math.max(1, this.currentPage - 1)
    const end = Math.min(this.totalPages, start + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    this.visiblePages = pages
    this.showEllipsis = end < this.totalPages - 1
  }
}
