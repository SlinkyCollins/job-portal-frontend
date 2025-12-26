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
    this.authService.goToDashboard(event);
  }

  toggleMegaDropdown() {
    this.showMegaDropdown = !this.showMegaDropdown;
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
