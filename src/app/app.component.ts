import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';  // For toasts
import {
  RouterOutlet,
  Router,
  Event,
  NavigationStart,
  NavigationCancel,
  NavigationError,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ScrolltopbtnComponent } from './shared/ui/scrolltopbtn/scrolltopbtn.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrolltopbtnComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  loading = false;
  navigationStartTime = 0;
  isOnline: boolean = navigator.onLine;  // Initial status
  private offlineToast: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        this.navigationStartTime = Date.now();
      }

      if (event instanceof NavigationEnd) {
        this.handleNavigationEnd();
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled');
        this.handleNavigationEnd();
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.handleNavigationEnd();
      }
    });
  }

  private handleNavigationEnd(): void {
    // Removed delay calculation for natural loading feel
    this.loading = false;
  }

  title = 'JobPortal';

  ngOnInit(): void {
    // Check initial status
    if (this.isOnline) {
      console.log("Initial status: Online");
    } else {
      console.log("Initial status: Offline");
      this.showOfflineToast();
    }

    // Add event listeners
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          const hash = window.location.hash;

          if (hash) {
            const el = document.querySelector(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 0);
      });
  }

  // Handle online event
  handleOnline() {
    console.log("You are now connected to the network.");
    this.isOnline = true;
    // Dismiss the offline toast before showing success
    if (this.offlineToast) {
      this.authService.toastr.remove(this.offlineToast.toastId);
      this.offlineToast = null;
    }

    this.authService.toastr.success('✅ Back online!', '', { timeOut: 3000 });
    // Optional: Re-sync data or refresh page
    // window.location.reload();
  }

  // Handle offline event
  handleOffline() {
    console.log("The network connection has been lost.");
    this.isOnline = false;
    this.showOfflineToast();
    // Optional: Queue requests or show offline mode
  }

  // Show offline toast
  private showOfflineToast() {
    this.offlineToast = this.authService.toastr.error('❌ No internet connection. Some features may not work.', 'Offline', {
      timeOut: 0,  // Persistent until online
      extendedTimeOut: 0,
      closeButton: true,
      tapToDismiss: false,
      positionClass: 'toast-bottom-center'
    });
  }
}