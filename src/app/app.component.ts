import { Component, OnInit } from '@angular/core';
import {
  RouterOutlet,
  Router,
  Event,
  NavigationStart,
  NavigationCancel,
  NavigationError,
  NavigationEnd,
} from '@angular/router';
import { ScrolltopbtnComponent } from './components/ui/scrolltopbtn/scrolltopbtn.component';
import { filter } from 'rxjs/operators';
// import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrolltopbtnComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
 loading = false;
  private navigationStartTime = 0;

  constructor(private router: Router) {
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
}