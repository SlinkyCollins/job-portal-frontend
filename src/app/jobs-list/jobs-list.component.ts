import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CtaComponent } from '../components/sections/cta/cta.component';
import { AuthService } from '../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jobs-list',
  standalone: true,
  imports: [CommonModule, CtaComponent, RouterLink],
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent implements OnInit {
  jobs: any[] = [];
  loading = true;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAllJobs().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.jobs = response.jobs;
        } else {
          console.warn('No jobs found');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.loading = false;
      }
    });
  }
}
