import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"

interface SavedJob {
  id: number
  title: string
  companyName: string
  companyLogo: string
  type: "Fulltime" | "Part time" | "Remote" | "Contract"
  salary: number
  salaryPeriod: "Monthly" | "Weekly" | "Hourly" | "Yearly"
  experienceLevel: string
  location: string
  tags: string[]
  timeSaved: string
}

interface SortOption {
  value: string
  label: string
}

@Component({
  selector: "app-saved-jobs",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./saved-jobs.component.html",
  styleUrls: ["./saved-jobs.component.css"],
})
export class SavedJobsComponent implements OnInit {
  // Page Configuration
  pageTitle = "Saved Job"
  sortLabel = "Short by"

  // Sort Options
  sortOptions: SortOption[] = [
    { value: "new", label: "New" },
    { value: "old", label: "Old" },
    { value: "salary-high", label: "Salary: High to Low" },
    { value: "salary-low", label: "Salary: Low to High" },
    { value: "company", label: "Company Name" },
  ]

  selectedSort = "new"

  // Saved Jobs Data
  savedJobs: SavedJob[] = [
    {
      id: 1,
      title: "Developer & expert in java c++",
      companyName: "TechCorp",
      companyLogo: "/placeholder.svg?height=50&width=50",
      type: "Fulltime",
      salary: 900,
      salaryPeriod: "Monthly",
      experienceLevel: "Fresher",
      location: "Spain, Barcelona",
      tags: ["Developer", "Coder"],
      timeSaved: "2 hours ago",
    },
    {
      id: 2,
      title: "Animator & Expert in maya 3D",
      companyName: "Creative Studio",
      companyLogo: "/placeholder.svg?height=50&width=50",
      type: "Part time",
      salary: 100,
      salaryPeriod: "Weekly",
      experienceLevel: "Intermediate",
      location: "USA, New York",
      tags: ["Finance", "Accounting"],
      timeSaved: "1 day ago",
    },
    {
      id: 3,
      title: "Marketing Specialist in SEO & SMM",
      companyName: "Digital Agency",
      companyLogo: "/placeholder.svg?height=50&width=50",
      type: "Part time",
      salary: 50,
      salaryPeriod: "Hourly",
      experienceLevel: "No-Experience",
      location: "USA, Alaska",
      tags: ["Design", "Artist"],
      timeSaved: "3 days ago",
    },
    {
      id: 4,
      title: "Developer & Expert in javascript c+",
      companyName: "StartupTech",
      companyLogo: "/placeholder.svg?height=50&width=50",
      type: "Fulltime",
      salary: 800,
      salaryPeriod: "Monthly",
      experienceLevel: "Internship",
      location: "USA, California",
      tags: ["Application", "Marketing"],
      timeSaved: "1 week ago",
    },
  ]

  // Pagination
  currentPage = 1
  totalPages = 7
  visiblePages: number[] = [1, 2, 3]
  showEllipsis = true

  constructor() {}

  ngOnInit(): void {
    this.updateVisiblePages()
  }

  // Methods
  getJobTypeClass(type: string): string {
    switch (type) {
      case "Fulltime":
        return "job-type-fulltime"
      case "Part time":
        return "job-type-parttime"
      case "Remote":
        return "job-type-remote"
      case "Contract":
        return "job-type-contract"
      default:
        return "job-type-default"
    }
  }

  onJobAction(action: string, job: SavedJob): void {
    console.log(`${action} action for job:`, job.title)

    switch (action) {
      case "view":
        // Navigate to job details
        break
      case "share":
        // Open share dialog
        break
      case "apply":
        // Navigate to application
        break
      case "remove":
        // Remove from saved jobs
        this.removeJob(job.id)
        break
    }
  }

  removeJob(jobId: number): void {
    this.savedJobs = this.savedJobs.filter((job) => job.id !== jobId)
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page
      this.updateVisiblePages()
      // Implement page change logic here
    }
  }

  private updateVisiblePages(): void {
    const pages: number[] = []
    const start = Math.max(1, this.currentPage - 1)
    const end = Math.min(this.totalPages, start + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    this.visiblePages = pages
    this.showEllipsis = end < this.totalPages - 1
  }
}
