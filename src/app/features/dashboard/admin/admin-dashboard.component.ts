import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InitialsPipe } from '../../../core/pipes/initials.pipe';
import { ToastrService } from 'ngx-toastr';
import { AdminUser } from '../../../core/models/admin-user.model';
import { Renderer2 } from '@angular/core';

@Component({
    selector: 'app-admin-dashboard',
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        CommonModule,
        InitialsPipe
    ],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
    public user: AdminUser | null = null;
    public sidebarOpen: boolean = false;
    public userDropdownOpen: boolean = false;
    public showLogoutConfirm: boolean = false;
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.getAdminData();
    }

    getAdminData(): void {
        this.authService.getAdminData().subscribe((response: any) => {
            if (response.status) {
                this.user = response.user;
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
            this.router.navigate(['/login']);
        })
    }

    logOut() {
        this.authService.logout();
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        // Close user dropdown when opening sidebar
        if (this.sidebarOpen) {
            this.userDropdownOpen = false;
        }
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
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }

    hideLogoutModal() {
        this.showLogoutConfirm = false;
        // Restore body scroll
        this.renderer.setStyle(document.body, 'overflow', 'auto');
    }

    confirmLogout() {
        this.hideLogoutModal();
        this.logOut();
    }

    closeSidebar() {
        this.sidebarOpen = false;
        this.userDropdownOpen = false;
    }

    toggleUserDropdown() {
        this.userDropdownOpen = !this.userDropdownOpen;
    }
}
