import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './employer-dashboard.component.html',
  styleUrl: './employer-dashboard.component.css'
})
export class EmployerDashboardComponent {
  public applications: any[] = [];
  public user: any = '';
  public sidebarOpen: boolean = false;
  public userDropdownOpen: boolean = false;
  public showLogoutConfirm: boolean = false;
  private chart: any;
  public photoURL: string = '';
  public completionPercentage: number = 0;
  public showCompletionSuccessModal: boolean = false;
  public companyId: number | null = null;
  public isAlertDismissed = false;

  constructor(
    public http: HttpClient,
    public router: Router,
    public authService: AuthService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getEmployerData();
  }

  logOut() {
    this.authService.firebaseSignOut();
    this.router.navigate(['/login']);
  }

  dismissAlert() {
    this.isAlertDismissed = true;
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

  ngAfterViewInit() {
    // Initialize chart if needed
    this.initializeChart();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleWindowResize.bind(this));
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private handleWindowResize() {
    if (window.innerWidth > 1024) {
      this.sidebarOpen = false;
      this.userDropdownOpen = false;
    }
  }

  private handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Close user dropdown if clicking outside
    if (!target.closest('.user-profile') && !target.closest('.user-dropdown')) {
      this.userDropdownOpen = false;
    }
  }

  private initializeChart() {
    // You can implement Chart.js or any other charting library here
    console.log('Chart initialized');
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    // Close user dropdown when opening sidebar
    if (this.sidebarOpen) {
      this.userDropdownOpen = false;
    }
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.userDropdownOpen = false;
  }

  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  onNavItemClick() {
    // Close mobile sidebar when nav item is clicked for better UX
    if (window.innerWidth <= 1024) {
      this.closeSidebar();
    }
  }

  showLogoutModal(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showLogoutConfirm = true;
    this.userDropdownOpen = false;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  hideLogoutModal() {
    this.showLogoutConfirm = false;
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }

  confirmLogout() {
    this.hideLogoutModal();
    this.logOut();
  }

  closeSuccessModal() {
    this.showCompletionSuccessModal = false;
  }
}