import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CtaComponent } from '../components/sections/cta/cta.component';
import { AuthService } from '../core/services/auth.service';
import { NavbarComponent } from '../components/sections/navbar/navbar.component';
import { FooterComponent } from '../components/sections/footer/footer.component';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, CtaComponent, NavbarComponent, FooterComponent],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
  standalone: true,
})
export class JobDetailsComponent implements OnInit {
  jobId: number | null = null;
  job: any = null;
  isLoading: boolean = true;
  hasApplied: boolean = false;
  isSaved: boolean = false;
  errorMsg: string | null = null;
  userRole: string | null = null;

  constructor(private route: ActivatedRoute, public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
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
          this.hasApplied = res.job.hasApplied || false; // ✅ No separate API call
          this.isSaved = res.job.isSaved || false; // ✅ No separate API call
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
    const userRole = localStorage.getItem('role');

    if (!userRole) {
      this.authService.toastr.warning('Please log in to apply.');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.applyToJob(this.jobId!).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.hasApplied = true; // ✅ Instantly disable button
          this.authService.toastr.success(res.msg);
        } else {
          this.authService.toastr.error(res.msg);
        }
      },
      error: (err) => {
        console.error(err);
        this.authService.toastr.error('An error occurred while applying.');
      }
    });
  }

  onSaveJob(): void {
    console.log('User clicked for save job ID:', this.jobId);
    const userRole = localStorage.getItem('role');

    if (!userRole) {
      this.authService.toastr.warning('Please log in to save jobs.');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.addToWishlist(this.jobId!).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.isSaved = true; // ✅ Instantly disable button
          this.authService.toastr.success(res.msg);
        } else {
          this.authService.toastr.error(res.msg);
        }
      },
      error: (err) => {
        console.error(err);
        this.authService.toastr.error('An error occurred while saving the job.');
      }
    });
  }
}
