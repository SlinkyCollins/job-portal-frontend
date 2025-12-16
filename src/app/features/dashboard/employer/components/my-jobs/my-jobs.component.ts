import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  jobs: any[] = [];
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.dashboardService.getEmployerJobs().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.jobs = res.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading jobs', err);
        this.isLoading = false;
      }
    });
  }

  deleteJob(jobId: number) {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {

      this.dashboardService.deleteJob(jobId).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Job deleted successfully');
            // Remove from array immediately (no need to reload page)
            this.jobs = this.jobs.filter(job => job.job_id !== jobId);
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
}