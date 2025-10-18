import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public isMenuOpen = false;
  public isExploreOpen: boolean = false;
  public showMegaDropdown: boolean = false;
  public currentRoute: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      })
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAuthPage(): boolean {
    return this.currentRoute.includes('/jobs') || this.currentRoute.includes('/signup') || this.currentRoute.includes('/jobdetails');
  }

  isHome(): boolean {
    return this.currentRoute === '/' || this.currentRoute.startsWith('/home');
  }

  goToDashboard(event: Event) {
    event.preventDefault(); // prevent normal link behavior

    const role = localStorage.getItem('role');

    if (!role) {
      this.authService.toastr.error('Please log in to access your dashboard.');
      this.router.navigate(['/login']);
      return;
    }

    if (role === 'job_seeker') {
      this.router.navigate(['/dashboard/jobseeker']);
      this.authService.toastr.success('Welcome back to your dashboard!');
    }
    else if (role === 'employer') {
      this.router.navigate(['/dashboard/employer']);
      this.authService.toastr.success('Welcome back to your employer dashboard!');
    }
    else if (role === 'admin') {
      this.router.navigate(['/dashboard/admin']);
      this.authService.toastr.success('Welcome back to your admin dashboard!');
    }
    else {
      this.authService.toastr.error('Unknown role. Please log in again.');
      this.router.navigate(['/login']);
    }
  }

  toggleExploreDropdown() {
    this.isExploreOpen = !this.isExploreOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      if (this.isAuthPage()) {
        navbar.classList.add('scrolled-auth');
      } else {
        navbar.classList.remove('scrolled-auth');
      }
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.remove('scrolled-auth');
    }
  }
}
