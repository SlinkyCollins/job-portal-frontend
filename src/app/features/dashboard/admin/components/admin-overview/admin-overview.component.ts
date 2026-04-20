import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.css'
})
export class AdminOverviewComponent implements OnInit {
  stats: any = {
    total_users: 0,
    job_seekers: 0,
    employers: 0,
    total_jobs: 0,
    applications: 0
  };
  isLoading: boolean = true;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (res: any) => {
        if (res?.status) {
          const payload = res.data ?? res; // works for both {data:{...}} and flat response
          this.stats = {
            total_users: Number(payload.total_users ?? 0),
            job_seekers: Number(payload.job_seekers ?? 0),
            employers: Number(payload.employers ?? 0),
            total_jobs: Number(payload.total_jobs ?? 0),
            applications: Number(payload.applications ?? 0)
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.isLoading = false;
      }
    });
  }
}
