import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { CapitalizeFirstPipe } from '../../../../../core/pipes/capitalize-first.pipe';
import { ToastrService } from 'ngx-toastr';
import { STATUS_COLORS } from '../../../../../core/constants/status-colors';
import { RelativeTimePipe } from '../../../../../core/pipes/relative-time.pipe';

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [CommonModule, CapitalizeFirstPipe, RelativeTimePipe, RouterLink],
  templateUrl: './applied-jobs.component.html',
  styleUrl: './applied-jobs.component.css'
})
export class AppliedJobsComponent implements OnInit {
  applications: any[] = [];
  isLoading: boolean = true;
  statusColors = STATUS_COLORS;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  
  private applicationToRetract: any = null;
  showRetractModal: boolean = false;
  isRetracting: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.dashboardService.getAllApplications().subscribe({
      next: (data: any) => {
        this.applications = data.applications || [];
        this.totalItems = this.applications.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.toastr.error('Failed to load applications');
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const normalizedStatus = status.toUpperCase();
    return (this.statusColors as any)[normalizedStatus] || '#757575';
  }

  viewJob(application: any) {
    this.router.navigate(['/jobdetails', application.job_id]);
  }

  retractApplication(application: any) {
    this.applicationToRetract = application;
    this.showRetractModal = true;
  }

  confirmRetract() {
    if (!this.applicationToRetract) return;
    this.isRetracting = true;
    this.dashboardService.retractApplication(this.applicationToRetract.application_id).subscribe({
      next: () => {
        this.applications = this.applications.filter(app => app.application_id !== this.applicationToRetract.application_id);
        this.toastr.success('Application successfully retracted.');
        this.showRetractModal = false;
        this.applicationToRetract = null;
        this.isRetracting = false;
      },
      error: (err) => {
        console.error('Error retracting application:', err);
        this.toastr.error('Could not retract application. Try again.');
        this.applicationToRetract = null;
        this.isRetracting = false;
      }
    });
  }

  closeRetractModal() {
    this.showRetractModal = false;
    this.applicationToRetract = null;
  }

  // Pagination logic
  get paginatedApplications() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.applications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
