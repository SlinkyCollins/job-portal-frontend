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
  isLoading = true; // Start loading
  public user: any = '';
  public companyId: number | null = null;
  public hasCompany: boolean = false;
  public userFirstName: string = '';
  isLoadingStats: boolean = true;
  isLoadingJobs: boolean = true;
  stats: any = {
    totalVisitors: 0,
    shortlisted: 0,
    views: 0,
    postedJobs: 0
  };
  recentJobs: any[] = [];
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
    // SUBSCRIBE to the state instead of calling API
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.userFirstName = user.firstname;
        this.companyId = user.company_id;
        
        // Logic to switch views
        if (this.companyId) {
          this.hasCompany = true;
          this.loadStats(); // Load stats only if company exists
          this.loadRecentJobs();
        } else {
          this.hasCompany = false;
        }
        
        this.isLoading = false; // Data received, stop loading
      }
    });
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
    this.dashboardService.getEmployerStats().subscribe({
      next: (data) => {
        this.stats.shortlisted = data.shortlisted || 0;
        this.stats.postedJobs = data.postedJobs || 0;
        this.stats.views = data.views || 0;
        this.stats.totalVisitors = data.totalVisitors || 0;
        this.isLoadingStats = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.isLoadingStats = false;
      }
    });
  }

  loadRecentJobs() {
    // TODO: Implement getRecentPostedJobs in DashboardService
    // For now, we'll simulate an empty list or mock data
    this.isLoadingJobs = false;
    this.recentJobs = []; 
    
    /* 
    this.dashboardService.getRecentPostedJobs().subscribe({
      next: (data) => {
        this.recentJobs = data.recentJobs || [];
        this.isLoadingJobs = false;
      },
      error: (err) => {
        console.error('Error loading jobs:', err);
        this.isLoadingJobs = false;
      }
    });
    */
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


