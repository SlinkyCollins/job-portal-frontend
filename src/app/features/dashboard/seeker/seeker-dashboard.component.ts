import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { InitialsPipe } from '../../../core/pipes/initials.pipe';

@Component({
  selector: 'app-seeker-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    RouterLink,
    InitialsPipe
  ],
  templateUrl: './seeker-dashboard.component.html',
  styleUrl: './seeker-dashboard.component.css'
})
export class SeekerDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public applications: any[] = [];
  public user: any = '';
  public sidebarOpen: boolean = false;
  public userDropdownOpen: boolean = false;
  public showLogoutConfirm: boolean = false;
  private chart: any;
  public photoURL: string = '';
  public completionPercentage: number = 0;
  public showCompletionSuccessModal: boolean = false;
  private isFirstLoad: boolean = true;
  public isAlertDismissed = false;

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public authService: AuthService,
    private dashboardService: DashboardService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.isAlertDismissed = false;
    // 1. Subscribe to Profile Updates (Photo/Name)
    this.profileService.profile$.subscribe(update => {
      this.photoURL = update.photoURL;
      this.user.firstname = update.firstname;
    });

    // 2. NEW: Subscribe to Completion Percentage Updates
    this.profileService.completion$.subscribe(percentage => {
      if (this.isFirstLoad) {
        if (percentage > 0) {
          this.isFirstLoad = false;
        }
      } else {
        // Trigger modal only when reaching 100% from a lower value
        if (this.completionPercentage < 100 && percentage === 100) {
          this.showCompletionSuccessModal = true;
        }
      }
      this.completionPercentage = percentage;
    });

    // 3. Load Initial Data
    this.loadProfile();

    // 4. Fetch Seeker Data
    this.getSeekerData();

    window.addEventListener('resize', this.handleWindowResize.bind(this));
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  dismissAlert() {
    this.isAlertDismissed = true;
  }

  loadProfile(): void {
    this.dashboardService.getSeekerProfile().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.user = response.profile;
          this.photoURL = this.user.profile_pic_url || '';

          // Initialize the service with the data we just fetched
          this.profileService.updateCompletionScore(this.user);
        }
      },
      error: (err) => console.error('Failed to load profile:', err)
    });
  }

  getSeekerData() {
    this.authService.getSeekerData().subscribe(
      (response: any) => {
        if (response.status === true) {
          this.user = response.user;
        }
      },
      (err: any) => {
        console.error('Error fetching user data:', err.status, err.statusText, err.message);
        let errorMsg = 'An unexpected error occurred. Please log in again.';
        if (err.status === 401) {
          errorMsg = 'Your token has expired. Please log in again.';
          this.toastr.warning(errorMsg, 'Token Timeout');
        } else if (err.status === 403) {
          errorMsg = 'You do not have permission to access this page.';
          this.toastr.error(errorMsg, 'Access Denied');
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
        this.router.navigate(['/login']);
        throw err; // Keep for debugging
      }
    );
  }

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

  logOut() {
    this.authService.firebaseSignOut();
    this.router.navigate(['/login']);
  }
}