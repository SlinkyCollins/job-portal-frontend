import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ScrolltopbtnComponent } from './components/ui/scrolltopbtn/scrolltopbtn.component';
import { filter } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrolltopbtnComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private auth: Auth) {
    console.log('Firebase Auth:', this.auth);
  }
  title = 'JobPortal';

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Delay ensures DOM elements are rendered before scrolling
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
