import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CtaComponent } from "../../../shared/sections/cta/cta.component";
import { NavbarComponent } from "../../../shared/sections/navbar/navbar.component";
import { FooterComponent } from "../../../shared/sections/footer/footer.component";
import { RelativeTimePipe } from "../../../core/pipes/relative-time.pipe";
import { AuthService } from "../../../core/services/auth.service";
import { FormsModule } from "@angular/forms";
import { DashboardService } from "../../../core/services/dashboard.service";
import { CapitalizeFirstPipe } from "../../../core/pipes/capitalize-first.pipe";

@Component({
  selector: "app-job-details",
  imports: [
    CommonModule,
    FormsModule,
    CtaComponent,
    NavbarComponent,
    FooterComponent,
    RouterLink,
    RelativeTimePipe,
    CapitalizeFirstPipe
  ],
  templateUrl: "./job-details.component.html",
  styleUrls: ["./job-details.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class JobDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('relatedSwiper', { static: false }) relatedSwiperEl!: ElementRef;

  jobId: number | null = null;
  job: any = null;
  isLoading = true;
  hasApplied = false;
  errorMsg: string | null = null;
  userRole: string | null = null;
  showFullDescription = false;
  relatedJobs: any[] = [];
  isApplying = false;
  isRetracted: boolean = false;

  // New properties for apply modal
  showApplyModal = false;
  coverLetter = '';
  selectedFile: File | null = null;
  selectedFileName = '';
  hasDefaultCV = false; // Will be set based on user data

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public dashboardService: DashboardService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem("role")
    this.jobId = Number(this.route.snapshot.paramMap.get("id"))

    if (this.jobId) {
      this.fetchJobDetails(this.jobId);
      this.fetchRelatedJobs();
      if (this.userRole === 'job_seeker') {
        this.checkDefaultCV(); // New: Check if user has default CV
      }
    } else {
      this.errorMsg = "Invalid job ID"
      this.isLoading = false
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get processedRequirements(): string[] {
    if (!this.job || !this.job.requirements) return [];
    return this.job.requirements.split('.').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  }

  ngAfterViewInit() {
    // Swiper navigation is handled automatically via navigation-next-el and navigation-prev-el
  }

  fetchJobDetails(id: number): void {
    this.authService.getJobDetails(id).subscribe({
      next: (res: any) => {
        if (res.status && res.job) {
          this.job = res.job
          this.hasApplied = res.job.hasApplied || false
          this.job.isSaved = res.job.isSaved || false;
          this.job.isSaving = false;
          this.isRetracted = res.job.isRetracted || false
          this.job.is_closed = res.job.is_closed || false; 
        } else {
          this.errorMsg = res.msg || "Job not found"
        }
        this.isLoading = false
      },
      error: (err) => {
        console.error(err)
        this.errorMsg = "An error occurred while fetching job details."
        this.isLoading = false
      },
    })
  }

  // New: Check if user has default CV
  checkDefaultCV(): void {
    this.dashboardService.getSeekerProfile().subscribe({
      next: (res: any) => {
        if (res.status && res.profile && res.profile.cv_url) {
          this.hasDefaultCV = true;
        }
      },
      error: (err) => {
        console.error('Error checking default CV:', err);
      }
    });
  }

  onApplyNow(): void {
    console.log("User clicked apply for job ID:", this.jobId)
    const userRole = localStorage.getItem("role")

    if (!userRole) {
      this.authService.toastr.warning("Please log in to apply.")
      this.router.navigate(["/login"])
      return
    }

    if (this.isRetracted) {
      this.authService.toastr.info('Application retracted. Contact support to re-apply.');
      return;
    }

    // Open the apply modal instead of direct submission
    this.showApplyModal = true;
  }

  // New: Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        this.authService.toastr.error('Invalid file type. Only PDF and DOCX allowed.');
        return;
      }
      if (file.size > maxSize) {
        this.authService.toastr.error('File too large. Max 10MB.');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  // New: Submit application via modal
  submitApplication(): void {
    if (!this.jobId) return;

    this.isApplying = true;

    const formData = new FormData();
    formData.append('jobId', this.jobId.toString());
    if (this.coverLetter.trim()) {
      formData.append('cover_letter', this.coverLetter.trim());
    }
    if (this.selectedFile) {
      formData.append('cv_file', this.selectedFile);
    }

    this.authService.applyToJobWithCV(formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.hasApplied = true;
          this.authService.toastr.success(res.msg);
          this.closeApplyModal();
        } else {
          this.authService.toastr.error(res.msg);
        }
        this.isApplying = false;
      },
      error: (err) => {
        console.error(err);
        this.authService.toastr.error("An error occurred while applying.");
        this.isApplying = false;
      },
    });
  }

  // New: Close modal and reset form
  closeApplyModal(): void {
    this.showApplyModal = false;
    this.coverLetter = '';
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  onToggleSaveJob(): void {
    this.authService.toggleSaveJob(this.job);
  }

  toggleDescription(): void {
    this.showFullDescription = !this.showFullDescription
  }

  fetchRelatedJobs(): void {
    // You can implement this to fetch related jobs from your API
    // For now, using mock data
    this.relatedJobs = [
      {
        job_id: 1,
        job_title: "Data Science Expert With Algorithm",
        company_name: "TechCorp",
        location: "Spain, Barcelona",
        job_type: "Fulltime",
        salary: 5000,
      },
      {
        job_id: 2,
        job_title: "UI/UX Product Management",
        company_name: "DesignHub",
        location: "USA, New York",
        job_type: "Part time",
        salary: 3500,
      },
      {
        job_id: 3,
        job_title: "Web Developer",
        company_name: "WebCraft",
        location: "UK, London",
        job_type: "Fulltime",
        salary: 4200,
      },
      {
        job_id: 4,
        job_title: "Mobile App Developer",
        company_name: "AppMakers",
        location: "Canada, Toronto",
        job_type: "Contract",
        salary: 4000,
      },
      {
        job_id: 5,
        job_title: "DevOps Engineer",
        company_name: "CloudNet",
        location: "Germany, Berlin",
        job_type: "Fulltime",
        salary: 5500,
      },
      {
        job_id: 6,
        job_title: "Digital Marketing Specialist",
        company_name: "MarketGurus",
        location: "Australia, Sydney",
        job_type: "Part time",
        salary: 3000,
      },
    ]
  }
}