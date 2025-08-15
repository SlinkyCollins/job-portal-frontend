import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { CtaComponent } from "../components/sections/cta/cta.component"
import { RouterLink } from "@angular/router"
import { NavbarComponent } from "../components/sections/navbar/navbar.component"
import { FooterComponent } from "../components/sections/footer/footer.component"

interface WishlistJob {
  id: number
  title: string
  company: string
  location: string
  salary: string
  jobType: string
  experienceLevel: string
  companyLogo: string
  logoColor: string
  isSaved: boolean
}

@Component({
  selector: "app-job-wishlist",
  standalone: true,
  imports: [CommonModule, FormsModule, CtaComponent, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: "./job-wishlist.component.html",
  styleUrls: ["./job-wishlist.component.css"],
})
export class JobWishlistComponent {
  sortBy = "recent"
  viewMode = "list" // 'list' or 'grid'

  wishlistJobs: WishlistJob[] = [
    {
      id: 1,
      title: "Chief Human Resource Officer",
      company: "TechCorp Inc.",
      location: "USA, Palo Alto",
      salary: "$3500 / Monthly",
      jobType: "Fixed-Price",
      experienceLevel: "Fresher",
      companyLogo: "TC",
      logoColor: "#6366f1",
      isSaved: true,
    },
    {
      id: 2,
      title: "Senior Product Designer",
      company: "Design Studio",
      location: "Remote",
      salary: "$4200 / Monthly",
      jobType: "Full-time",
      experienceLevel: "Senior",
      companyLogo: "DS",
      logoColor: "#10b981",
      isSaved: true,
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      salary: "$5000 / Monthly",
      jobType: "Contract",
      experienceLevel: "Mid-level",
      companyLogo: "SX",
      logoColor: "#f59e0b",
      isSaved: true,
    },
    {
      id: 4,
      title: "Marketing Manager",
      company: "Growth Co.",
      location: "New York, NY",
      salary: "$3800 / Monthly",
      jobType: "Full-time",
      experienceLevel: "Mid-level",
      companyLogo: "GC",
      logoColor: "#ef4444",
      isSaved: true,
    },
    {
      id: 5,
      title: "Data Scientist",
      company: "AI Labs",
      location: "Boston, MA",
      salary: "$6000 / Monthly",
      jobType: "Full-time",
      experienceLevel: "Senior",
      companyLogo: "AL",
      logoColor: "#8b5cf6",
      isSaved: true,
    },
  ]

  get jobCount(): number {
    return this.wishlistJobs.filter((job) => job.isSaved).length
  }

  get filteredJobs(): WishlistJob[] {
    return this.wishlistJobs.filter((job) => job.isSaved)
  }

  onSortChange(sortValue: string): void {
    this.sortBy = sortValue
    // Implement sorting logic here
    console.log("Sorting by:", sortValue)
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === "list" ? "grid" : "list"
  }

  toggleSaveJob(jobId: number): void {
    const job = this.wishlistJobs.find((j) => j.id === jobId)
    if (job) {
      job.isSaved = !job.isSaved
    }
  }

  applyToJob(jobId: number): void {
    console.log("Applying to job:", jobId)
    // Implement apply logic here
  }

  viewJobDetails(jobId: number): void {
    console.log("Viewing job details:", jobId)
    // Implement navigation to job details
  }

  trackByJobId(index: number, job: WishlistJob): number {
    return job.id
  }

  getJobTypeBadgeClass(jobType: string): string {
    switch (jobType.toLowerCase()) {
      case "fixed-price":
        return "fixed-price"
      case "full-time":
        return "full-time"
      case "contract":
        return "contract"
      case "part-time":
        return "part-time"
      default:
        return "full-time"
    }
  }
}
