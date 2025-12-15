import { Component } from '@angular/core';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { Chart } from 'chart.js';
import { STATUS_COLORS } from '../../../../../core/constants/status-colors';
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
  isLoading: boolean = false;
  public user: any = '';
  public companyId: number | null = null;
  public hasCompany: boolean = false;
  public userFirstName: string = '';
  private applicationToRetract: any = null;
  showRetractModal: boolean = false;
  isRetracting: boolean = false;
  isLoadingStats: boolean = true;
  isLoadingApplications: boolean = true;
  stats: any = {
    totalVisitors: 0,
    shortlisted: 0,
    views: 0,
    appliedJobs: 0
  };
  recentApplications: any[] = [];
  profileViewsData: any = {};
  chart: Chart | null = null;
  activeTab: string = 'Day';

  // Expose constants to template
  statusColors = STATUS_COLORS;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
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

  getEmployerData(): void {
    this.authService.getEmployerData().subscribe((response: any) => {
      if (response.status) {
        this.user = response.user;
        this.companyId = this.user.company_id;

        if (!this.companyId) {
          this.toastr.info('Please complete your company profile to start posting jobs.', 'Welcome!');
        }
      }
    }, (err: any) => {
      console.error('Error fetching user data:', err.status, err.message);
      let errorMsg = 'An unexpected error occurred. Please log in again.';
      if (err.status === 401) {
        errorMsg = 'Your token has expired. Please log in again.';
        this.toastr.warning(errorMsg, 'Token Timeout');
      } else if (err.status === 403) {
        errorMsg = 'You do not have permission to access this page.';
        this.toastr.error(errorMsg, 'Access Denied');
        this.authService.goBack();
      } else if (err.status === 404) {
        errorMsg = 'We could not find your user data. Please contact support.';
        this.toastr.info(errorMsg, 'User Not Found');
      } else if (err.status === 500) {
        errorMsg = 'Something went wrong on our end. Please try again later.';
        this.toastr.error(errorMsg, 'Server Error');
      } else {
        this.toastr.error(errorMsg, 'Error');
      }

      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      this.router.navigate(['/login']);
    })
  };

  loadStats() {
    this.dashboardService.getSeekerStats().subscribe({
      next: (data) => {
        this.stats.shortlisted = data.shortlisted || 0;
        this.stats.appliedJobs = data.appliedJobs || 0;
        // Keep others as 0 or placeholders
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
        this.stats.appliedJobs--;
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


