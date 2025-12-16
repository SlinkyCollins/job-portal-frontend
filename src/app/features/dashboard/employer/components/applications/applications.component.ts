import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.dashboardService.getApplications().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status) {
          this.applications = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateStatus(appId: number, newStatus: string) {
    this.dashboardService.updateApplicationStatus(appId, newStatus).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success(`Candidate marked as ${newStatus}`);
          // Update UI locally
          const app = this.applications.find(a => a.application_id === appId);
          if (app) app.status = newStatus;
        }
      },
      error: (err) => this.toastr.error('Failed to update status')
    });
  }
}