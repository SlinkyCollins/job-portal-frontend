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
  private readonly STORAGE_KEYS = {
    search: 'jobSearch',
    filters: 'activeFilters',
    filterState: 'jobFilterState',
  };
  Math = Math; // Added to expose Math to the template
  jobs: any[] = [];
  loading = true;
  isSearching = false;
  applyingFilters = false;
  allCategories: any[] = [];
  activeFilters: string[] = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.filters) || '[]');
  searchLocation: string = '';
  searchCategory: number | null = null;
  searchKeyword: string = '';
  isSelectOpen1 = false;
  isSaving = false;
  expandedSections = {
    location: true,
    jobType: true,
    experience: true, // Default expanded to match screenshot
    salary: true, // Default expanded to match screenshot
    category: false,
    tags: false,
  };
  userRole: string | null = null;
  showFilterModal: boolean = false;

  jobTypes = [
    { label: 'Full Time', value: 'fulltime', selected: false },
    { label: 'Part Time', value: 'parttime', selected: false },
    { label: 'Contract', value: 'contract', selected: false },
    { label: 'Internship', value: 'internship', selected: false },
    { label: 'Freelance', value: 'freelance', selected: false },
    { label: 'Fixed Price', value: 'fixedprice', selected: false },
    { label: 'Remote', value: 'remote', selected: false }
  ];

  experienceLevels = [
    { label: 'Fresher', value: 'Fresher', selected: false },
    { label: 'Junior', value: 'Junior', selected: false },
    { label: 'Intermediate', value: 'Mid', selected: false },
    { label: 'Senior', value: 'Senior', selected: false },
    { label: 'No Experience', value: 'No-Experience', selected: false },
    { label: 'Internship', value: 'Internship', selected: false },
    { label: 'Expert', value: 'Expert', selected: false }
  ];

  constructor(
    public authService: AuthService,
    public apiService: ApiServiceService,
    public router: Router,
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.loadCategories();

    // One single restore flow
    this.restoreSearchAndFilters();
  }


  restoreSearchAndFilters(): void {
    const savedSearch = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.search) || '{}');
    const savedFilters = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.filterState) || '{}');
    const savedActiveFilters = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.filters) || '[]');

    // Restore search inputs
    this.searchCategory = savedSearch.category === null || savedSearch.category == 'null' ? null : savedSearch.category;
    this.searchLocation = savedSearch.location ?? '';
    this.searchKeyword = savedSearch.keyword ?? '';

    let hasFilters = false;

    // Restore checkbox states
    if (savedFilters.jobTypes) {
      this.jobTypes.forEach(type => {
        const saved = savedFilters.jobTypes.find((j: any) => j.value === type.value);
        if (saved && saved.selected) {
          type.selected = true;
          hasFilters = true;
        }
      });
    }

    if (savedFilters.experienceLevels) {
      this.experienceLevels.forEach(exp => {
        const saved = savedFilters.experienceLevels.find((e: any) => e.value === exp.value);
        if (saved && saved.selected) {
          exp.selected = true;
          hasFilters = true;
        }
      });
    }

    // Restore active filter chips
    this.activeFilters = savedActiveFilters;

    // Merge everything into one params object
    const params: any = { ...savedSearch };

    const selectedJobTypes = this.jobTypes.filter(j => j.selected);
    const selectedExperiences = this.experienceLevels.filter(e => e.selected);

    if (selectedJobTypes.length > 0) {
      params['employment_type[]'] = selectedJobTypes.map(j => j.value);
    }

    if (selectedExperiences.length > 0) {
      params['experience_level[]'] = selectedExperiences.map(e => e.value);
    }

    // ✅ Fetch jobs with all restored filters and search
    this.fetchJobs(params);
  }



  toggleSelectOpen1() {
    this.isSelectOpen1 = !this.isSelectOpen1;
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
    // Start a short delay before showing the spinner
    const showSpinnerDelay = setTimeout(() => {
      this.loading = true;
    }, 200); // 👈 show spinner only if it takes longer than 200ms

    this.http
      .get<any>(`${this.apiService.apiUrl}/jobs.php`, { params })
      .subscribe({
        next: (res) => {
          clearTimeout(showSpinnerDelay);
          this.jobs = res.jobs || [];
          this.loading = false;
          this.applyingFilters = false;
          this.isSearching = false;
        },
        error: (err) => {
          clearTimeout(showSpinnerDelay);
          console.error('Error fetching jobs:', err);
          this.loading = false;
          this.applyingFilters = false;
          this.isSearching = false;
        },
      });
  }

  buildSearchAndFilterParams(): any {
    const search = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.search) || '{}');
    const selectedJobTypes = this.jobTypes.filter(j => j.selected).map(j => j.value);
    const selectedExperiences = this.experienceLevels.filter(e => e.selected).map(e => e.value);

    return {
      category: this.searchCategory,
      location: this.searchLocation.trim(),
      keyword: this.searchKeyword.trim(),
      ...(selectedJobTypes.length ? { 'employment_type[]': selectedJobTypes } : {}),
      ...(selectedExperiences.length ? { 'experience_level[]': selectedExperiences } : {}),
      ...search
    };
  }

  onSearch(): void {
    this.isSearching = true;

    // Normalize the "None" option → treat 0 as null
    const normalizedCategory = this.searchCategory === 0 ? null : this.searchCategory;

    const searchState = {
      category: normalizedCategory,
      location: this.searchLocation.trim(),
      keyword: this.searchKeyword.trim(),
    };
    localStorage.setItem(this.STORAGE_KEYS.search, JSON.stringify(searchState));

    // Fetch with both search and filters
    this.fetchJobs(this.buildSearchAndFilterParams());
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

  applyFiltersAndToggleModal(): void {
    this.toggleFilterModal();
    this.applyFilters();
  }

  applyFilters(): void {
    this.applyingFilters = true;

    // Save filter states
    const filterState = {
      jobTypes: this.jobTypes,
      experienceLevels: this.experienceLevels
    };
    localStorage.setItem(this.STORAGE_KEYS.filterState, JSON.stringify(filterState));

    // Active filter badges
    this.activeFilters = [
      ...this.jobTypes.filter(j => j.selected).map(j => j.label),
      ...this.experienceLevels.filter(e => e.selected).map(e => e.label)
    ];
    localStorage.setItem(this.STORAGE_KEYS.filters, JSON.stringify(this.activeFilters));

    // Fetch with both filters + search
    this.fetchJobs(this.buildSearchAndFilterParams());
  }

  toggleJobType(type: any) {
    type.selected = !type.selected;
  }

  toggleExperience(exp: any) {
    exp.selected = !exp.selected;
  }

  resetFilters(clearSearch: boolean = false): void {
    // Reset all filter checkboxes
    this.jobTypes.forEach(t => t.selected = false);
    this.experienceLevels.forEach(e => e.selected = false);

    // Clear active filter badges
    this.activeFilters = [];

    // Remove saved filter data
    localStorage.removeItem(this.STORAGE_KEYS.filters);
    localStorage.removeItem(this.STORAGE_KEYS.filterState);

    // 🧠 Only clear search form if user confirms or passes true
    if (clearSearch) {
      this.searchCategory = null;
      this.searchLocation = '';
      this.searchKeyword = '';
      localStorage.removeItem(this.STORAGE_KEYS.search);
    }

    // Fetch jobs again — respect current search values if not cleared
    this.fetchJobs(this.buildSearchAndFilterParams());
  }

  resetFiltersAndToggleModal(clearSearch: boolean = false) : void {
    this.resetFilters(clearSearch);
    this.toggleFilterModal();
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  toggleSection(section: string): void {
    this.expandedSections[section as keyof typeof this.expandedSections] =
      !this.expandedSections[section as keyof typeof this.expandedSections];
  }

  removeFilter(filter: string): void {
    this.activeFilters = this.activeFilters.filter(
      (f) => f !== filter
    );
    // Check if the filter is a job type
    const jobType = this.jobTypes.find((jt) => jt.label === filter);
    if (jobType) {
      jobType.selected = false;
      this.applyFilters();
      return;
    }
    // Check if the filter is an experience level
    const experience = this.experienceLevels.find((exp) => exp.label === filter);
    if (experience) {
      experience.selected = false;
      this.applyFilters();
      return;
    }
  }

  getJobTypeClass(jobType: string): string {
    switch (jobType.toLowerCase()) {
      case 'fulltime':
        return 'full-time';
      case 'parttime':
        return 'part-time';
      case 'contract':
        return 'contract';
      case 'internship':
        return 'internship';
      case 'freelance':
        return 'freelance';
      case 'fixedprice':
        return 'fixed-price';
      case 'remote':
        return 'remote';
      default:
        return '';
    }
  }
}