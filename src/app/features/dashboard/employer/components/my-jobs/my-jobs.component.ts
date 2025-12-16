import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../../../core/services/dashboard.service';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  jobs: any[] = [];
  isLoading = true;

  constructor(private dashboardService: DashboardService) {}

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

  // Placeholder for future actions
  deleteJob(jobId: number) {
    if(confirm('Are you sure you want to delete this job?')) {
      console.log('Delete job', jobId);
      // We will implement delete logic later
    }
  }
}