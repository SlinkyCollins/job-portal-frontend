import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { InitialsPipe } from '../../../../../core/pipes/initials.pipe';

@Component({
  selector: 'app-job-management',
  standalone: true,
  imports: [CommonModule, InitialsPipe],
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit {
  jobs: any[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.adminService.getAllJobs().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.jobs = res.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.isLoading = false;
      }
    });
  }

  deleteJob(jobId: number) {
    if (confirm('Are you sure you want to delete this job? This cannot be undone.')) {
      this.adminService.deleteJob(jobId).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastr.success('Job deleted successfully');
            this.loadJobs(); // Refresh list
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
}