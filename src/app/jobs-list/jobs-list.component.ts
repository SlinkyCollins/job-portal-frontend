import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { CtaComponent } from "../components/sections/cta/cta.component"
import { Router, RouterLink } from "@angular/router"
import { NavbarComponent } from "../components/sections/navbar/navbar.component"
import { FooterComponent } from "../components/sections/footer/footer.component"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../core/services/auth.service"

interface Job {
  id: number
  title: string
  company: string
  logo: string
  jobType: "Fulltime" | "Part time" | "Fixed-Price" | "Freelance"
  salary: number
  salaryPeriod: "Monthly" | "Weekly" | "Hourly"
  location: string
  experience: string
  category: string
  tags: string[]
}

interface FilterOptions {
  jobTypes: { name: string; count: number; selected: boolean }[]
  experiences: { name: string; count: number; selected: boolean }[]
  salaryRange: { min: number; max: number; current: { min: number; max: number } }
  categories: string[]
  tags: string[]
}

@Component({
  selector: "app-job-list",
  templateUrl: "./jobs-list.component.html",
  imports: [CommonModule, FormsModule, CtaComponent, RouterLink, NavbarComponent, FooterComponent],
  styleUrls: ["./jobs-list.component.css"],
})
export class JobsListComponent implements OnInit {
  Math = Math // Added to expose Math to the template
  jobs: any[] = []
  loading = true
  expandedSections = {
    location: true,
    jobType: true,
    experience: true, // Default expanded to match screenshot
    salary: true, // Default expanded to match screenshot
    category: false,
    tags: false,
  }
  selectedPeriod = "weekly" // Default to weekly as shown in screenshot
  showMoreCategories = false
  showMoreTags = false
  selectedLocation = "Spain, Barcelona"

  constructor(
    public authService: AuthService,
    public router: Router,
  ) {}

  // jobs: Job[] = [
  //   {
  //     id: 1,
  //     title: 'Developer & expert in java c++',
  //     company: 'TechCorp',
  //     logo: '💻',
  //     jobType: 'Fulltime',
  //     salary: 900,
  //     salaryPeriod: 'Monthly',
  //     location: 'Spain, Barcelona',
  //     experience: 'Expert',
  //     category: 'Developer',
  //     tags: ['Java', 'C++']
  //   },
  //   {
  //     id: 2,
  //     title: 'Animator & Expert in maya 3D',
  //     company: 'CreativeStudio',
  //     logo: '🎨',
  //     jobType: 'Part time',
  //     salary: 100,
  //     salaryPeriod: 'Weekly',
  //     location: 'USA, New York',
  //     experience: 'Expert',
  //     category: 'Design',
  //     tags: ['Maya', '3D', 'Animation']
  //   },
  //   {
  //     id: 3,
  //     title: 'Marketing Specialist in SEO & SMM',
  //     company: 'MarketPro',
  //     logo: '📈',
  //     jobType: 'Part time',
  //     salary: 50,
  //     salaryPeriod: 'Hourly',
  //     location: 'USA, Alaska',
  //     experience: 'Intermediate',
  //     category: 'Marketing',
  //     tags: ['SEO', 'SMM', 'Marketing']
  //   },
  //   {
  //     id: 4,
  //     title: 'Developer & Expert in javascript c+',
  //     company: 'WebSolutions',
  //     logo: '🚀',
  //     jobType: 'Fulltime',
  //     salary: 800,
  //     salaryPeriod: 'Monthly',
  //     location: 'USA, California',
  //     experience: 'Expert',
  //     category: 'Developer',
  //     tags: ['JavaScript', 'C++']
  //   },
  //   {
  //     id: 5,
  //     title: 'Lead & Product Designer',
  //     company: 'DesignHub',
  //     logo: '🎯',
  //     jobType: 'Fulltime',
  //     salary: 1200,
  //     salaryPeriod: 'Monthly',
  //     location: 'UK, London',
  //     experience: 'Expert',
  //     category: 'Design',
  //     tags: ['Product Design', 'Leadership']
  //   },
  //   {
  //     id: 6,
  //     title: 'Web Developer',
  //     company: 'WebCraft',
  //     logo: '🌐',
  //     jobType: 'Fixed-Price',
  //     salary: 1500,
  //     salaryPeriod: 'Monthly',
  //     location: 'USA, Mountain View',
  //     experience: 'Intermediate',
  //     category: 'Developer',
  //     tags: ['Web Development', 'Frontend']
  //   },
  //   {
  //     id: 7,
  //     title: 'Data Scientist',
  //     company: 'DataTech',
  //     logo: '📊',
  //     jobType: 'Freelance',
  //     salary: 2500,
  //     salaryPeriod: 'Weekly',
  //     location: 'Germany, Berlin',
  //     experience: 'Expert',
  //     category: 'Data Science',
  //     tags: ['Python', 'Machine Learning']
  //   },
  //   {
  //     id: 8,
  //     title: 'UX/UI Designer',
  //     company: 'UserFirst',
  //     logo: '🎨',
  //     jobType: 'Fulltime',
  //     salary: 1800,
  //     salaryPeriod: 'Monthly',
  //     location: 'USA, Cupertino',
  //     experience: 'Intermediate',
  //     category: 'Design',
  //     tags: ['UX', 'UI', 'Figma']
  //   }
  // ];

  filteredJobs: Job[] = []
  activeFilters: string[] = []
  showFilterModal = false
  currentPage = 1
  itemsPerPage = 8
  totalPages = 1
  searchLocation = "Spain, Barcelona"
  searchCategory = "Developer"

  filterOptions: FilterOptions = {
    jobTypes: [
      { name: "Fulltime", count: 12, selected: false },
      { name: "Part time", count: 8, selected: false },
      { name: "Fixed-Price", count: 4, selected: false },
      { name: "Freelance", count: 4, selected: false },
    ],
    experiences: [
      { name: "Fresher", count: 6, selected: false },
      { name: "Intermediate", count: 4, selected: false },
      { name: "No-Experience", count: 6, selected: false },
      { name: "Internship", count: 6, selected: false },
      { name: "Expert", count: 6, selected: false },
    ],
    salaryRange: {
      min: 0,
      max: 3500,
      current: { min: 0, max: 3500 },
    },
    categories: ["Developer", "Design", "Marketing", "Data Science"],
    tags: ["Java", "C++", "JavaScript", "Python", "React", "Angular"],
  }

  locations = ["Spain, Barcelona", "USA, New York", "UK, London", "Germany, Berlin", "France, Paris"]

  allCategories = [
    { name: "Developer", count: 6, selected: false },
    { name: "Coder", count: 2, selected: false },
    { name: "Finance", count: 6, selected: false },
    { name: "Accounting", count: 4, selected: false },
    { name: "Design", count: 2, selected: false },
    { name: "Artist", count: 2, selected: false },
    { name: "Application", count: 2, selected: false },
    { name: "Marketing", count: 4, selected: false },
    { name: "Business", count: 2, selected: false },
    { name: "Web", count: 2, selected: false },
    { name: "Data", count: 2, selected: false },
    { name: "Scientist", count: 2, selected: false },
    { name: "Designer", count: 4, selected: false },
    { name: "UX/UI", count: 2, selected: false },
    { name: "Manager", count: 2, selected: false },
    { name: "Engineer", count: 2, selected: false },
    { name: "Writer", count: 2, selected: false },
    { name: "Content", count: 2, selected: false },
    { name: "Graphic", count: 2, selected: false },
    { name: "Management", count: 2, selected: false },
    { name: "Product", count: 2, selected: false },
    { name: "Software", count: 2, selected: false },
    { name: "Engineering", count: 2, selected: false },
    { name: "Illustration", count: 2, selected: false },
    { name: "Frontend", count: 2, selected: false },
  ]

  allTags = [
    { name: "java", selected: false },
    { name: "developer", selected: false },
    { name: "finance", selected: false },
    { name: "accounting", selected: false },
    { name: "design", selected: false },
    { name: "seo", selected: false },
    { name: "javascript", selected: false },
    { name: "designer", selected: false },
    { name: "web", selected: false },
    { name: "frontend", selected: false },
    { name: "data", selected: false },
    { name: "analytics", selected: false },
    { name: "ui", selected: false },
    { name: "ux", selected: false },
    { name: "marketing", selected: false },
    { name: "management", selected: false },
    { name: "software", selected: false },
    { name: "engineering", selected: false },
    { name: "writing", selected: false },
    { name: "blogging", selected: false },
    { name: "graphic", selected: false },
    { name: "illustration", selected: false },
    { name: "product", selected: false },
  ]

  ngOnInit(): void {
    this.applyFilters()
    this.authService.getAllJobs().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.jobs = response.jobs
        } else {
          console.warn("No jobs found")
        }
        this.loading = false
      },
      error: (err) => {
        console.error("Error fetching jobs:", err)
        this.loading = false
      },
    })
  }

  onToggleSaveJob(job: any) {
    if (!this.authService.isLoggedIn()) {
      this.authService.toastr.warning("Please log in to save jobs.")
      this.router.navigate(["/login"])
      return
    }

    if (job.isSaved) {
      // Call backend to unsave (when implemented)
      this.authService.removeFromWishlist(job.job_id).subscribe({
        next: (res: any) => {
          if (res.status) {
            job.isSaved = false
            this.authService.toastr.success("Job removed from saved jobs.")
          } else {
            this.authService.toastr.error(res.msg)
          }
        },
        error: () => this.authService.toastr.error("Error removing saved job."),
      })
    } else {
      this.authService.addToWishlist(job.job_id).subscribe({
        next: (res: any) => {
          if (res.status) {
            job.isSaved = true
            this.authService.toastr.success("Job saved!")
          } else {
            this.authService.toastr.error(res.msg)
          }
        },
        error: () => this.authService.toastr.error("Error saving job."),
      })
    }
  }

  toggleFilterModal(): void {
    this.showFilterModal = !this.showFilterModal
  }

  toggleJobTypeFilter(jobType: string): void {
    const filter = this.filterOptions.jobTypes.find((jt) => jt.name === jobType)
    if (filter) {
      filter.selected = !filter.selected
      this.updateActiveFilters()
      this.applyFilters()
    }
  }

  toggleExperienceFilter(experience: string): void {
    const filter = this.filterOptions.experiences.find((exp) => exp.name === experience)
    if (filter) {
      filter.selected = !filter.selected
      this.updateActiveFilters()
      this.applyFilters()
    }
  }

  toggleCategory(category: any): void {
    category.selected = !category.selected
    this.updateActiveFilters()
    this.applyFilters()
  }

  toggleTag(tag: any): void {
    tag.selected = !tag.selected
    this.updateActiveFilters()
    this.applyFilters()
  }

  toggleShowMoreCategories(): void {
    this.showMoreCategories = !this.showMoreCategories
  }

  toggleShowMoreTags(): void {
    this.showMoreTags = !this.showMoreTags
  }

  updateActiveFilters(): void {
    this.activeFilters = []

    // Add selected job types
    this.filterOptions.jobTypes.filter((jt) => jt.selected).forEach((jt) => this.activeFilters.push(jt.name))

    // Add selected experiences
    this.filterOptions.experiences.filter((exp) => exp.selected).forEach((exp) => this.activeFilters.push(exp.name))

    // Add selected categories
    this.allCategories.filter((cat) => cat.selected).forEach((cat) => this.activeFilters.push(cat.name))

    // Add selected tags
    this.allTags.filter((tag) => tag.selected).forEach((tag) => this.activeFilters.push(tag.name))
  }

  resetFilters(): void {
    this.filterOptions.jobTypes.forEach((jt) => (jt.selected = false))
    this.filterOptions.experiences.forEach((exp) => (exp.selected = false))
    this.allCategories.forEach((cat) => (cat.selected = false))
    this.allTags.forEach((tag) => (tag.selected = false))
    this.filterOptions.salaryRange.current = { ...this.filterOptions.salaryRange }
    this.selectedLocation = "Spain, Barcelona"
    this.activeFilters = []
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.jobs]

    // Apply job type filters
    const selectedJobTypes = this.filterOptions.jobTypes.filter((jt) => jt.selected).map((jt) => jt.name)

    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) => selectedJobTypes.includes(job.jobType))
    }

    // Apply experience filters
    const selectedExperiences = this.filterOptions.experiences.filter((exp) => exp.selected).map((exp) => exp.name)

    if (selectedExperiences.length > 0) {
      filtered = filtered.filter((job) => selectedExperiences.includes(job.experience))
    }

    // Apply location filter
    if (this.selectedLocation) {
      filtered = filtered.filter((job) => job.location === this.selectedLocation)
    }

    // Apply category filters
    const selectedCategories = this.allCategories.filter((cat) => cat.selected).map((cat) => cat.name)

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) => selectedCategories.includes(job.category))
    }

    // Apply tag filters
    const selectedTags = this.allTags.filter((tag) => tag.selected).map((tag) => tag.name)

    if (selectedTags.length > 0) {
      filtered = filtered.filter((job) => selectedTags.some((tag) => job.tags.includes(tag)))
    }

    this.filteredJobs = filtered
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage)
    this.currentPage = 1
  }

  getPaginatedJobs(): Job[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.filteredJobs.slice(startIndex, endIndex)
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  getJobTypeClass(jobType: string): string {
    const classes: { [key: string]: string } = {
      Fulltime: "badge-fulltime",
      "Part time": "badge-parttime",
      "Fixed-Price": "badge-fixed",
      Freelance: "badge-freelance",
    }
    return classes[jobType] || "badge-default"
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1)
  }

  toggleSection(section: string): void {
    this.expandedSections[section as keyof typeof this.expandedSections] =
      !this.expandedSections[section as keyof typeof this.expandedSections]
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period
    // Add logic to handle period change if needed
  }

  getVisibleCategories() {
    return this.showMoreCategories ? this.allCategories : this.allCategories.slice(0, 5)
  }

  getVisibleTags() {
    return this.showMoreTags ? this.allTags : this.allTags.slice(0, 12)
  }

  removeFilter(filter:any){
    console.log('filter removed');
  }
}