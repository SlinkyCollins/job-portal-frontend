import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { DeleteaccountComponent } from '../../../components/sections/deleteaccount/deleteaccount.component';

@Component({
  selector: 'app-seeker-dashboard',
  imports: [CommonModule, RouterLink, RouterModule, DeleteaccountComponent, RouterLink],
  templateUrl: './seeker-dashboard.component.html',
  styleUrl: './seeker-dashboard.component.css'
})
export class SeekerDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public applications: any[] = [];
  public user: any = '';
  public sidebarOpen: boolean = false;
  public userDropdownOpen: boolean = false;
  public showLogoutConfirm: boolean = false;
  public showDeleteModal = false; // Delete modal state
  private chart: any;

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
  this.authService.getSeekerData().subscribe(
    (response: any) => {
      if (response.status === true) {
        this.user = response.user;
      }
    },
    (err: any) => {
      console.error('Error fetching session:', err.status, err.statusText, err.message);
      let errorMsg = 'An unexpected error occurred. Please log in again.';
      if (err.status === 401) {
        errorMsg = 'Your session has expired. Please log in again.';
        this.toastr.warning(errorMsg, 'Session Timeout');
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
      localStorage.removeItem('userId');
      this.router.navigate(['/login']);
      throw err; // Keep for debugging
    }
  );

  window.addEventListener('resize', this.handleWindowResize.bind(this));
  document.addEventListener('click', this.handleDocumentClick.bind(this));
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

  // Delete Account Modal Methods
  openDeleteModal() {
    this.showDeleteModal = true
    console.log("Delete modal opened") // For debugging
  }

  handleAccountDeletion() {
    console.log("Account deletion confirmed!")
    // Your deletion logic here
    this.showDeleteModal = false // Close modal

    // You can add your actual account deletion API call here
    // this.authService.deleteAccount().subscribe(...)
  }

  closeDeleteModal() {
    this.showDeleteModal = false
    console.log("Delete modal closed") // For debugging
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

  logOut() {
    localStorage.removeItem('role');
    this.authService.firebaseSignOut();
    this.router.navigate(['/login']);
  }
}