import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../components/sections/navbar/navbar.component';
import { FooterComponent } from '../components/sections/footer/footer.component';
import { CommonModule } from '@angular/common';
import { CtaComponent } from '../components/sections/cta/cta.component';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-job-details',
  imports: [NavbarComponent, FooterComponent, CommonModule, CtaComponent],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
  standalone: true,
})
export class JobDetailsComponent implements OnInit {
  jobId: number | null = null;
  job: any = null;
  isLoading = true;
  errorMsg: string | null = null;

  constructor(private route: ActivatedRoute, public authService: AuthService) { }

  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.jobId) {
      this.fetchJobDetails(this.jobId);
    } else {
      this.errorMsg = 'Invalid job ID';
      this.isLoading = false;
    }
  }

  fetchJobDetails(id: number): void {
    this.authService.getJobDetails(id).subscribe({
      next: (res: any) => {
        if (res.status && res.job) {
          this.job = res.job;
        } else {
          this.errorMsg = res.msg || 'Job not found';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'An error occurred while fetching job details.';
        this.isLoading = false;
      },
    });
  }

  onApplyNow(): void {
    console.log('User clicked apply for job ID:', this.jobId);
    // handle navigation or modal opening here
  }

  onSaveJob(): void {
    console.log('Save job clicked for job ID:', this.jobId);
    // save job logic here
  }
}
