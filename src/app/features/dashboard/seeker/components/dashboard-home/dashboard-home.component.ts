import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { Chart, registerables } from 'chart.js';
import { Router, RouterLink } from '@angular/router';
import { CapitalizeFirstPipe } from '../../../../../core/pipes/capitalize-first.pipe';
import { ToastrService } from 'ngx-toastr';
import { STATUS_COLORS } from '../../../../../core/constants/status-colors';
import { RelativeTimePipe } from '../../../../../core/pipes/relative-time.pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  imports: [
    CommonModule,
    CapitalizeFirstPipe,
    RouterLink,
    RelativeTimePipe
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private applicationToRetract: any = null;
  showRetractModal: boolean = false;
  isRetracting: boolean = false;
  isLoadingStats: boolean = true;
  isLoadingApplications: boolean = true;
  stats = {
    applied: 0,
    shortlisted_apps: 0,
    accepted: 0,
    saved_jobs: 0
  };
  recentApplications: any[] = [];
  profileViewsData: any = {};
  chart: Chart | null = null;
  activeTab: string = 'Day';

  // Expose constants to template
  statusColors = STATUS_COLORS;

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  getStatusColor(status: string): string {
    const normalizedStatus = status.toUpperCase();
    return (this.statusColors as any)[normalizedStatus] || '#757575';
  }

  ngOnInit() {
    this.loadStats();
    this.loadRecentApplications();
  }

  ngAfterViewInit() {
    // Chart will be initialized after data is loaded
    this.initializeChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadStats() {
    this.dashboardService.getSeekerStats().subscribe({
      next: (res: any) => {
        // Check if the response status is true and data exists
        if (res.status && res.data) {
          this.stats.applied = res.data.applied || 0;
          this.stats.shortlisted_apps = res.data.shortlisted_apps || 0;
          this.stats.accepted = res.data.accepted || 0;
          this.stats.saved_jobs = res.data.saved_jobs || 0;
        }
        
        this.isLoadingStats = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.isLoadingStats = false;
      }
    });
  }

  loadRecentApplications() {
    this.dashboardService.getRecentApplications().subscribe({
      next: (data) => {
        this.recentApplications = data.recentApplications || [];
        this.isLoadingApplications = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.isLoadingApplications = false;
      }
    });
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
        this.recentApplications = this.recentApplications.filter(app => app.application_id !== this.applicationToRetract.application_id);
        this.stats.applied--;
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

  initializeChart() {
    const ctx = document.getElementById('jobViewsChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const data = this.getChartDataForTab(this.activeTab);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Profile Views',
          data: data.values,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  getChartDataForTab(tab: string): { labels: string[], values: number[] } {
    // Mock data based on tab - replace with actual data from API
    switch (tab) {
      case '1h':
        return {
          labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM'],
          values: [2, 1, 0, 1, 3, 2, 4, 6, 8, 5, 7, 9]
        };
      case 'Day':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          values: [12, 19, 15, 25, 22, 18, 14]
        };
      case 'Week':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          values: [65, 89, 80, 95]
        };
      case 'Month':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          values: [28, 48, 40, 19, 86, 27]
        };
      case 'Year':
        return {
          labels: ['2020', '2021', '2022', '2023', '2024'],
          values: [65, 59, 80, 81, 95]
        };
      default:
        return { labels: [], values: [] };
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.initializeChart();
  }

  trackByApplicationId(index: number, application: any): any {
    return application.application_id;
  }
}
