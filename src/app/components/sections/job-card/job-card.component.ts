import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { AuthService } from '../../../core/services/auth.service';
import { RelativeTimePipe } from '../../../core/pipes/relative-time.pipe';

@Component({
  selector: 'app-job-card',
  imports: [CommonModule, RouterLink, RelativeTimePipe],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
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

  fetchRecentJobs(): void {
    // Logic to fetch recent jobs can be implemented here
    this.loading = true;

    this.http
      .get<any>(`${this.apiService.apiUrl}/recent_jobs.php`)
      .subscribe({
        next: (res) => {
          this.jobs = res.jobs || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching jobs:', err);
          this.loading = false;
        },
      });
  }

  onToggleSaveJob(job: any) {
    this.authService.toggleSaveJob(job);
  }
}
