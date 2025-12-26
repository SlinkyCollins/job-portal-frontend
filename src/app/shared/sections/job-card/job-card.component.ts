import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { RelativeTimePipe } from '../../../core/pipes/relative-time.pipe';

// Define endpoint constant
export const API = {
  RECENT_JOBS: 'jobs/recent_jobs'
}

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RelativeTimePipe],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent implements OnInit {
  public jobs: any[] = [];
  public loading: boolean = false;
  public userRole: string | null = null;

  constructor(
    private http: HttpClient,
    private apiService: ApiServiceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.fetchRecentJobs();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserRole(): string | null {
    return this.authService.getUserRole();
  }

  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }

  fetchRecentJobs(): void {
    this.loading = true;
    this.http.get<any>(this.fullUrl(API.RECENT_JOBS)).subscribe({
      next: (res) => {
        // Ensure we handle different response structures
        this.jobs = res.jobs || res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.loading = false;
      },
    });
  }

  onToggleSaveJob(job: any) {
    // Optimistic UI update could be handled here if authService returns observable
    this.authService.toggleSaveJob(job);
  }
}