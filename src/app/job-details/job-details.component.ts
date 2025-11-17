import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CtaComponent } from "../components/sections/cta/cta.component";
import { AuthService } from "../core/services/auth.service";
import { NavbarComponent } from "../components/sections/navbar/navbar.component";
import { FooterComponent } from "../components/sections/footer/footer.component";
import { RelativeTimePipe } from "../core/pipes/relative-time.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: "app-job-details",
  imports: [CommonModule, CtaComponent, NavbarComponent, FooterComponent, RouterLink, RelativeTimePipe],
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
  isSaved = false;
  errorMsg: string | null = null;
  userRole: string | null = null;
  showFullDescription = false;
  relatedJobs: any[] = [];
  isApplying = false;
  isSaving = false;
  isRetracted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem("role")
    this.jobId = Number(this.route.snapshot.paramMap.get("id"))

    if (this.jobId) {
      this.fetchJobDetails(this.jobId);
      this.fetchRelatedJobs();
    } else {
      this.errorMsg = "Invalid job ID"
      this.isLoading = false
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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
          this.isSaved = res.job.isSaved || false
          this.isRetracted = res.job.isRetracted || false 
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

    // Set loading state to true
    this.isApplying = true

    this.authService.applyToJob(this.jobId!).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.hasApplied = true
          this.authService.toastr.success(res.msg)
        } else {
          this.authService.toastr.error(res.msg)
        }
        // Set loading state to false
        this.isApplying = false
      },
      error: (err) => {
        console.error(err)
        this.authService.toastr.error("An error occurred while applying.")
        // Set loading state to false on error
        this.isApplying = false
      },
    })
  }

  onSaveJob(): void {
    console.log("User clicked for save job ID:", this.jobId)
    const userRole = localStorage.getItem("role")

    if (!userRole) {
      this.authService.toastr.warning("Please log in to save jobs.")
      this.router.navigate(["/login"])
      return
    }

    // Set loading state to true
    this.isSaving = true

    this.authService.addToWishlist(this.jobId!).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.isSaved = true
          this.authService.toastr.success(res.msg)
        } else {
          this.authService.toastr.error(res.msg)
        }
        // Set loading state to false
        this.isSaving = false
      },
      error: (err) => {
        console.error(err)
        this.authService.toastr.error("An error occurred while saving the job.")
        // Set loading state to false on error
        this.isSaving = false
      },
    })
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