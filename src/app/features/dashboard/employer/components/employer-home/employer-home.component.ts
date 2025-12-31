import { Component } from '@angular/core';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { Router, RouterLink } from '@angular/router';
import { Chart } from 'chart.js';
import { CapitalizeFirstPipe } from '../../../../../core/pipes/capitalize-first.pipe';
import { RelativeTimePipe } from '../../../../../core/pipes/relative-time.pipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-employer-home',
  imports: [CapitalizeFirstPipe, RelativeTimePipe, CommonModule, RouterLink],
  templateUrl: './employer-home.component.html',
  styleUrl: './employer-home.component.css'
})
export class EmployerHomeComponent {
  isLoading = true;
  public user: any = '';
  public companyId: number | null = null;
  public hasCompany: boolean = false;
  public userFirstName: string = '';
  stats: any = {
    totalApplications: 0,
    shortlisted: 0,
    activeJobs: 0,
    postedJobs: 0
  };
  recentJobs: any[] = [];
  profileViewsData: any = {};
  chart: Chart | null = null;
  activeTab: string = 'Day';

  statusColors = {
    ACTIVE: '#28a745',   // Green
    CLOSED: '#757575',   // Grey
    PENDING: '#ffc107',  // Amber/Yellow
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) { }

  getStatusColor(status: string): string {
    const normalizedStatus = status.toUpperCase();
    return (this.statusColors as any)[normalizedStatus] || '#757575';
  }

  ngOnInit() {
    this.isLoading = true;

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.userFirstName = user.firstname;
        this.companyId = user.company_id;

        if (this.companyId) {
          this.hasCompany = true;
          this.loadStatsAndJobs();
        } else {
          this.hasCompany = false;
          this.isLoading = false;
        }
      }
    });
  }

  ngAfterViewInit() {
    this.initializeChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadStatsAndJobs() {
    this.dashboardService.getEmployerDashboardData().subscribe({
      next: (res: any) => {
        if (res.status) {
          // Map Backend keys to Frontend keys
          this.stats.postedJobs = res.stats.total_jobs;
          this.stats.activeJobs = res.stats.active_jobs;
          this.stats.totalApplications = res.stats.total_applications;
          this.stats.shortlisted = res.stats.shortlisted_count;

          // Load Jobs
          this.recentJobs = res.recentJobs;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  viewJob(job: any) {
    this.router.navigate(['/jobdetails', job.job_id]);
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

  trackByJobId(index: number, job: any): any {
    return job.job_id;
  }
}


