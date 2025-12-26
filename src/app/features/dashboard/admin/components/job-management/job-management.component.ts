import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { InitialsPipe } from '../../../../../core/pipes/initials.pipe';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-job-management',
  standalone: true,
  imports: [CommonModule, InitialsPipe],
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit, OnDestroy {
  jobs: any[] = [];
  isLoading = true;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;

  // Modal State
  showDeleteConfirm: boolean = false;
  jobToDelete: number | null = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  ngOnDestroy(): void {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  loadJobs() {
    this.isLoading = true;
    this.adminService.getAllJobs().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.jobs = res.data;
          this.currentPage = 1; // Reset to page 1
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.toastr.error('Failed to load jobs');
        this.isLoading = false;
      }
    });
  }

  // --- Pagination Logic ---
  get paginatedJobs() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.jobs.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.jobs.length / this.pageSize);
  }

  get totalPagesArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // --- Delete Logic ---
  showDeleteModal(jobId: number) {
    this.jobToDelete = jobId;
    this.showDeleteConfirm = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  hideDeleteModal() {
    this.showDeleteConfirm = false;
    this.jobToDelete = null;
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  confirmDelete() {
    if (this.jobToDelete !== null) {
      this.adminService.deleteJob(this.jobToDelete).pipe(
        finalize(() => this.hideDeleteModal())
      ).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Job deleted successfully');
            // Optimistic update
            this.jobs = this.jobs.filter(j => j.job_id !== this.jobToDelete);
            
            // Adjust page if empty
            if (this.paginatedJobs.length === 0 && this.currentPage > 1) {
              this.currentPage--;
            }
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (err) => {
          this.toastr.error('Failed to delete job');
        }
      });
    }
  }

  deleteJob(jobId: number) {
    this.showDeleteModal(jobId);
  }
}