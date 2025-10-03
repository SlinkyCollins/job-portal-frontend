import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CtaComponent } from '../components/sections/cta/cta.component';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/sections/navbar/navbar.component';
import { FooterComponent } from '../components/sections/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService } from '../core/services/api-service.service';

interface Job {
  job_id: number;
  title: string;
  salary_amount: number;
  currency: string;
  salary_duration: string;
  created_at: string;
  isSaved: boolean;
  company_id: number;
  company: string;
  logo: string;
  jobType: 'Fulltime' | 'Part time' | 'Contract' | 'Remote' | 'Fixed-Price' | 'Freelance';
  salary: number;
  salaryPeriod: 'Monthly' | 'Weekly' | 'Hourly';
  location: string;
  experience: string;
  category: string;
  tags: string[];
}

interface FilterOptions {
  jobTypes: { name: string; count: number; selected: boolean }[];
  experiences: { name: string; count: number; selected: boolean }[];
  salaryRange: {
    min: number;
    max: number;
    current: { min: number; max: number };
  };
  categories: string[];
  tags: string[];
}

@Component({
  selector: 'app-job-list',
  templateUrl: './jobs-list.component.html',
  imports: [
    CommonModule,
    FormsModule,
    CtaComponent,
    RouterLink,
    NavbarComponent,
    FooterComponent,
  ],
  styleUrls: ['./jobs-list.component.css'],
})
export class JobsListComponent implements OnInit {
  Math = Math; // Added to expose Math to the template
  jobs: any[] = [];
  loading = true;
  isSearching = false;
  allCategories: any[] = [];
  searchLocation: string = '';
  searchCategory: number | null = null;
  searchKeyword: string = '';
  isSelectOpen1 = false;
  expandedSections = {
    location: true,
    jobType: true,
    experience: true, // Default expanded to match screenshot
    salary: true, // Default expanded to match screenshot
    category: false,
    tags: false,
  };
  toggleSelectOpen1() {
    this.isSelectOpen1 = !this.isSelectOpen1;
  }
  selectedPeriod = 'weekly'; // Default to weekly as shown in screenshot
  showMoreCategories = false;
  showMoreTags = false;
  isSaving = false;
  userRole: string | null = null;

  constructor(
    public authService: AuthService,
    public apiService: ApiServiceService,
    public router: Router,
    public http: HttpClient
  ) {}

  filteredJobs: Job[] = [];
  activeFilters: string[] = [];
  showFilterModal = false;
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  filterOptions: FilterOptions = {
    jobTypes: [
      { name: 'Fulltime', count: 12, selected: false },
      { name: 'Part time', count: 8, selected: false },
      { name: 'Fixed-Price', count: 4, selected: false },
      { name: 'Freelance', count: 4, selected: false },
      { name: 'Contract', count: 5, selected: false },
      { name: 'Internship', count: 7, selected: false },
      { name: 'Remote', count: 4, selected: false },
    ],
    experiences: [
      { name: 'Fresher', count: 6, selected: false },
      { name: 'Junior', count: 6, selected: false },
      { name: 'Intermediate', count: 4, selected: false },
      { name: 'Senior', count: 6, selected: false },
      { name: 'No-Experience', count: 6, selected: false },
      { name: 'Internship', count: 6, selected: false },
      { name: 'Expert', count: 6, selected: false },
    ],
    salaryRange: {
      min: 0,
      max: 50000,
      current: { min: 0, max: 100000 },
    },
    categories: ['Developer', 'Design', 'Marketing', 'Data Science'],
    tags: ['Java', 'C++', 'JavaScript', 'Python', 'React', 'Angular'],
  };

  allTags = [
    { name: 'java', selected: false },
    { name: 'developer', selected: false },
    { name: 'finance', selected: false },
    { name: 'accounting', selected: false },
    { name: 'design', selected: false },
    { name: 'seo', selected: false },
    { name: 'javascript', selected: false },
    { name: 'designer', selected: false },
    { name: 'web', selected: false },
    { name: 'frontend', selected: false },
    { name: 'data', selected: false },
    { name: 'analytics', selected: false },
    { name: 'ui', selected: false },
    { name: 'ux', selected: false },
    { name: 'marketing', selected: false },
    { name: 'management', selected: false },
    { name: 'software', selected: false },
    { name: 'engineering', selected: false },
    { name: 'writing', selected: false },
    { name: 'blogging', selected: false },
    { name: 'graphic', selected: false },
    { name: 'illustration', selected: false },
    { name: 'product', selected: false },
  ];

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.applyFilters();
    this.fetchJobs(); // load all jobs on page load
    this.loadCategories();
  }

  loadCategories() {
    this.http
      .get<{ status: boolean; categories: any[] }>(
        `${this.apiService.apiUrl}/get_categories.php`
      )
      .subscribe((res) => {
        if (res.status) {
          this.allCategories = res.categories;
        }
      });
  }

  fetchJobs(params: any = {}): void {
    this.loading = true;

    this.http
      .get<any>(`${this.apiService.apiUrl}/jobs.php`, { params })
      .subscribe({
        next: (res) => {
          this.jobs = res.jobs || [];
          this.loading = false;
          this.isSearching = false;
        },
        error: (err) => {
          console.error('Error fetching jobs:', err);
          this.loading = false;
          this.isSearching = false;
        },
      });
  }

  onSearch(): void {
    this.isSearching = true;
    this.fetchJobs({
      category: this.searchCategory,
      location: this.searchLocation,
      keyword: this.searchKeyword,
    });
  }

  onToggleSaveJob(job: any) {
    if (!this.authService.isLoggedIn()) {
      this.authService.toastr.warning('Please log in to save jobs.');
      this.router.navigate(['/login']);
      return;
    }

    // Set loading state for this specific job
    job.isSaving = true;

    if (job.isSaved) {
      // Call backend to unsave
      this.authService.removeFromWishlist(job.job_id).subscribe({
        next: (res: any) => {
          if (res.status) {
            job.isSaved = false;
            this.authService.toastr.success('Job removed from saved jobs.');
          } else {
            this.authService.toastr.error(res.msg);
          }
          job.isSaving = false;
        },
        error: () => {
          this.authService.toastr.error('Error removing saved job.');
          job.isSaving = false;
        },
      });
    } else {
      this.authService.addToWishlist(job.job_id).subscribe({
        next: (res: any) => {
          if (res.status) {
            job.isSaved = true;
            this.authService.toastr.success('Job saved!');
          } else {
            this.authService.toastr.error(res.msg);
          }
          job.isSaving = false;
        },
        error: () => {
          this.authService.toastr.error('Error saving job.');
          job.isSaving = false;
        },
      });
    }
  }

  getRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1D ago';
    if (diffDays < 7) return `${diffDays}D ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}W ago`;
    return `${Math.ceil(diffDays / 30)}M ago`;
  }

  toggleFilterModal(): void {
    this.showFilterModal = !this.showFilterModal;
  }

  toggleJobTypeFilter(jobType: string): void {
    const filter = this.filterOptions.jobTypes.find(
      (jt) => jt.name === jobType
    );
    if (filter) {
      filter.selected = !filter.selected;
      this.updateActiveFilters();
      this.applyFilters();
    }
  }

  toggleExperienceFilter(experience: string): void {
    const filter = this.filterOptions.experiences.find(
      (exp) => exp.name === experience
    );
    if (filter) {
      filter.selected = !filter.selected;
      this.updateActiveFilters();
      this.applyFilters();
    }
  }

  toggleCategory(category: any): void {
    category.selected = !category.selected;
    this.updateActiveFilters();
    this.applyFilters();
  }

  toggleTag(tag: any): void {
    tag.selected = !tag.selected;
    this.updateActiveFilters();
    this.applyFilters();
  }

  toggleShowMoreCategories(): void {
    this.showMoreCategories = !this.showMoreCategories;
  }

  toggleShowMoreTags(): void {
    this.showMoreTags = !this.showMoreTags;
  }

  updateActiveFilters(): void {
    this.activeFilters = [];

    // Add selected job types
    this.filterOptions.jobTypes
      .filter((jt) => jt.selected)
      .forEach((jt) => this.activeFilters.push(jt.name));

    // Add selected experiences
    this.filterOptions.experiences
      .filter((exp) => exp.selected)
      .forEach((exp) => this.activeFilters.push(exp.name));

    // Add selected categories
    this.allCategories
      .filter((cat) => cat.selected)
      .forEach((cat) => this.activeFilters.push(cat.name));

    // Add selected tags
    this.allTags
      .filter((tag) => tag.selected)
      .forEach((tag) => this.activeFilters.push(tag.name));
  }

  resetFilters(): void {
    this.filterOptions.jobTypes.forEach((jt) => (jt.selected = false));
    this.filterOptions.experiences.forEach((exp) => (exp.selected = false));
    this.allCategories.forEach((cat) => (cat.selected = false));
    this.allTags.forEach((tag) => (tag.selected = false));
    this.filterOptions.salaryRange.current = {
      ...this.filterOptions.salaryRange,
    };
    this.activeFilters = [];
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.jobs];

    // Apply job type filters
    const selectedJobTypes = this.filterOptions.jobTypes
      .filter((jt) => jt.selected)
      .map((jt) => jt.name);

    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) =>
        selectedJobTypes.includes(job.jobType)
      );
    }

    // Apply experience filters
    const selectedExperiences = this.filterOptions.experiences
      .filter((exp) => exp.selected)
      .map((exp) => exp.name);

    if (selectedExperiences.length > 0) {
      filtered = filtered.filter((job) =>
        selectedExperiences.includes(job.experience)
      );
    }

    // Apply category filters
    const selectedCategories = this.allCategories
      .filter((cat) => cat.selected)
      .map((cat) => cat.name);

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) =>
        selectedCategories.includes(job.category)
      );
    }

    // Apply tag filters
    const selectedTags = this.allTags
      .filter((tag) => tag.selected)
      .map((tag) => tag.name);

    if (selectedTags.length > 0) {
      filtered = filtered.filter((job) =>
        selectedTags.some((tag) => job.tags.includes(tag))
      );
    }

    this.filteredJobs = filtered;
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedJobs(): Job[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredJobs.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getJobTypeClass(jobType: string): string {
    const classes: { [key: string]: string } = {
      Fulltime: 'badge-fulltime',
      'Part time': 'badge-parttime',
      'Fixed-Price': 'badge-fixed',
      Freelance: 'badge-freelance',
    };
    return classes[jobType] || 'badge-default';
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  toggleSection(section: string): void {
    this.expandedSections[section as keyof typeof this.expandedSections] =
      !this.expandedSections[section as keyof typeof this.expandedSections];
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    // Add logic to handle period change if needed
  }

  getVisibleCategories() {
    return this.showMoreCategories
      ? this.allCategories
      : this.allCategories.slice(0, 5);
  }

  getVisibleTags() {
    return this.showMoreTags ? this.allTags : this.allTags.slice(0, 12);
  }

  removeFilter(activeFilters: any) {
    this.activeFilters = this.activeFilters.filter(
      (filter: any) => filter !== activeFilters
    );
  }
}
