import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Options } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CtaComponent } from '../../../shared/sections/cta/cta.component';
import { NavbarComponent } from '../../../shared/sections/navbar/navbar.component';
import { FooterComponent } from '../../../shared/sections/footer/footer.component';
import { RelativeTimePipe } from '../../../core/pipes/relative-time.pipe';
import { AuthService } from '../../../core/services/auth.service';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { CategoryService } from '../../../core/services/category.service';
export const API = {
  ALL_JOBS: 'jobs/all_jobs'
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
    RelativeTimePipe,
    NgxSliderModule
  ],
  styleUrls: ['./jobs-list.component.css'],
})
export class JobsListComponent implements OnInit {
  private readonly STORAGE_KEYS = {
    search: 'jobSearch',
    filters: 'activeFilters',
    filterState: 'jobFilterState',
    sort: 'jobSort',
    page: 'jobPage'
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
  selectedCurrency: 'NGN' | 'USD' | 'GBP' | 'EUR' | null = null;  // Default to NGN
  salaryRange = { min: 0, max: 0 };  // Default (Start empty)
  selectedPeriod: string | null = null;  // Default to null
  showCurrencyNotice: boolean = false;  // Controls when to show the currency notice
  isSelectOpen = false;
  expandedSections = {
    jobType: false,
    experience: false,
    salary: false,
    tags: false,
  };
  get sliderOptions(): Options {
    return {
      floor: 0,
      ceil: this.getMaxSalary(),
      step: 1000,
      showTicks: false,
      showTicksValues: false,
      translate: (value: number): string => {
        return `${value.toLocaleString()} ${this.selectedCurrency}`;
      }
    };
  };
  userRole: string | null = null;
  showFilterModal: boolean = false;
  selectedSort: string = 'datePosted';
  showMoreTags: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  perPage: number = 6;
  totalJobs: number = 0;

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

  tags = [
    { name: 'JavaScript', value: 'JavaScript', selected: false, count: 0 },
    { name: 'Python', value: 'Python', selected: false, count: 0 },
    { name: 'PHP', value: 'PHP', selected: false, count: 0 },
    { name: 'Laravel', value: 'Laravel', selected: false, count: 0 },
    { name: 'React', value: 'React', selected: false, count: 0 },
    { name: 'Vue.js', value: 'Vue.js', selected: false, count: 0 },
    { name: 'Figma', value: 'Figma', selected: false, count: 0 },
    { name: 'UI/UX', value: 'UI/UX', selected: false, count: 0 },
    { name: 'SEO', value: 'SEO', selected: false, count: 0 },
    { name: 'Content Writing', value: 'Content Writing', selected: false, count: 0 },
    { name: 'Data Analysis', value: 'Data Analysis', selected: false, count: 0 },
    { name: 'Machine Learning', value: 'Machine Learning', selected: false, count: 0 },
    { name: 'Excel', value: 'Excel', selected: false, count: 0 },
    { name: 'Leadership', value: 'Leadership', selected: false, count: 0 },
    { name: 'Communication', value: 'Communication', selected: false, count: 0 },
    { name: 'SQL', value: 'SQL', selected: false, count: 0 },
    { name: 'Node.js', value: 'Node.js', selected: false, count: 0 },
    { name: 'Flutter', value: 'Flutter', selected: false, count: 0 },
    { name: 'Dart', value: 'Dart', selected: false, count: 0 },
    { name: 'WordPress', value: 'WordPress', selected: false, count: 0 },
    { name: 'Fullstack', value: 'Fullstack', selected: false, count: 0 },
    { name: 'Angular', value: 'Angular', selected: false, count: 0 },
    { name: 'Java', value: 'java', selected: false, count: 0 },
    { name: 'Developer', value: 'developer', selected: false, count: 0 },
    { name: 'Finance', value: 'finance', selected: false, count: 0 },
    { name: 'Design', value: 'design', selected: false, count: 0 },
    { name: 'Seo', value: 'seo', selected: false, count: 0 },
    { name: 'Analytics', value: 'analytics', selected: false, count: 0 },
    { name: 'Data', value: 'data', selected: false, count: 0 },
    { name: 'Frontend', value: 'frontend', selected: false, count: 0 },
    { name: 'Other', value: 'other', selected: false, count: 0 },
    { name: 'Marketing', value: 'marketing', selected: false, count: 0 },
    { name: 'Management', value: 'management', selected: false, count: 0 },
    { name: 'Software', value: 'software', selected: false, count: 0 },
    { name: 'Engineering', value: 'engineering', selected: false, count: 0 },
    { name: 'Writing', value: 'writing', selected: false, count: 0 },
    { name: 'Blogging', value: 'blogging', selected: false, count: 0 },
    { name: 'Graphic', value: 'graphic', selected: false, count: 0 },
    { name: 'Illustration', value: 'illustration', selected: false, count: 0 },
    { name: 'Product', value: 'product', selected: false, count: 0 }
  ];

  constructor(
    public authService: AuthService,
    public apiService: ApiServiceService,
    public router: Router,
    public http: HttpClient,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadCategories();

    // One single restore flow
    this.restoreSearchAndFilters();
  }

  fullUrl(endpoint: string) {
    return `${this.apiService.apiUrl}/${endpoint}`;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  clearLocation() {
    this.searchLocation = '';
  }

  clearKeyword() {
    this.searchKeyword = '';
  }

  restoreSearchAndFilters(): void {
    const searchRaw = localStorage.getItem(this.STORAGE_KEYS.search);
    const filterStateRaw = localStorage.getItem(this.STORAGE_KEYS.filterState);
    const filtersRaw = localStorage.getItem(this.STORAGE_KEYS.filters);
    const sortRaw = localStorage.getItem(this.STORAGE_KEYS.sort);
    const pageRaw = localStorage.getItem(this.STORAGE_KEYS.page);

    // Parse with fallbacks and type annotations for safety
    const savedSearch: any = JSON.parse(searchRaw || '{}');
    const savedFilters: any = JSON.parse(filterStateRaw || '{}');
    const savedActiveFilters: string[] = JSON.parse(filtersRaw || '[]');

    // Restore sort (default to 'datePosted' if not found)
    this.selectedSort = sortRaw || 'datePosted';

    // Restore Page (Default to 1 if not found)
    this.currentPage = pageRaw ? parseInt(pageRaw, 10) : 1;

    // Helper function to check if there's at least one meaningful search value
    const hasAnySearchValue = (search: any): boolean => {
      return (
        (search.category !== undefined && search.category !== null) ||
        search.location !== '' ||
        search.keyword !== ''
      );
    };

    // Set isSearching based on whether any search value exists
    if (hasAnySearchValue(savedSearch)) {
      this.isSearching = true;
    } else {
      this.isSearching = false;
    }

    // Restore search inputs
    this.searchCategory =
      !savedSearch || savedSearch.category === undefined || savedSearch.category === null
        ? null
        : savedSearch.category;
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

    // Restore tags (fix: check if value is in array)
    if (savedFilters.tags && Array.isArray(savedFilters.tags)) {
      this.tags.forEach(tag => {
        if (savedFilters.tags.includes(tag.value)) {  // 👈 Check if tag value is in saved array
          tag.selected = true;
        }
      });
    }

    // Restore Salary Filters
    if (savedFilters.currency) {
      this.selectedCurrency = savedFilters.currency;
      this.showCurrencyNotice = true;  // Show notice if currency was previously applied
    } else {
      this.selectedCurrency = null;  // Default to null if not saved
      this.showCurrencyNotice = false;
    }
    if (savedFilters.min_salary !== undefined) {
      this.salaryRange.min = savedFilters.min_salary;
    } else {
      this.salaryRange.min = 0;
    }
    if (savedFilters.max_salary !== undefined) {
      this.salaryRange.max = savedFilters.max_salary;
    } else {
      this.salaryRange.max = 0;
    }
    if (savedFilters.salary_duration) {
      this.selectedPeriod = savedFilters.salary_duration;
    } else {
      this.selectedPeriod = null;
    }

    // Restore active filter chips
    this.activeFilters = savedActiveFilters;

    // Merge everything into one params object
    const params: any = { ...savedSearch };

    const selectedJobTypes = this.jobTypes.filter(j => j.selected);
    const selectedExperiences = this.experienceLevels.filter(e => e.selected);
    const selectedTags = this.tags.filter(tag => tag.selected);

    if (selectedJobTypes.length > 0) {
      params['employment_type[]'] = selectedJobTypes.map(j => j.value);
    }

    if (selectedExperiences.length > 0) {
      params['experience_level[]'] = selectedExperiences.map(e => e.value);
    }

    if (selectedTags.length > 0) {
      params['tags[]'] = selectedTags.map(t => t.value);
    }

    if (this.selectedCurrency) {
      params.currency = this.selectedCurrency;
      params.min_salary = this.salaryRange.min;
      params.max_salary = this.salaryRange.max;
    }

    // Send duration only if selected
    if (this.selectedPeriod) {
      params.salary_duration = this.selectedPeriod;
    }

    params['sort'] = this.selectedSort;

    // ✅ Fetch jobs with all restored filters and search
    this.fetchJobs(params);
  }

  toggleSelectOpen() {
    this.isSelectOpen = !this.isSelectOpen;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => {
      this.allCategories = cats;
    });
  }

  fetchJobs(params: any = {}): void {
    // Add pagination params
    params.page = this.currentPage;
    params.per_page = this.perPage;

    // SAVE CURRENT PAGE TO STORAGE
    localStorage.setItem(this.STORAGE_KEYS.page, this.currentPage.toString());

    // Start a short delay before showing the spinner
    const showSpinnerDelay = setTimeout(() => {
      this.loading = true;
    }, 200); // 👈 show spinner only if it takes longer than 200ms

    this.http
      .get<any>(this.fullUrl(API.ALL_JOBS), { params })
      .subscribe({
        next: (res) => {
          clearTimeout(showSpinnerDelay);
          this.jobs = res.jobs || [];

          // Update pagination info
          this.totalJobs = res.total || 0;
          this.totalPages = Math.ceil(this.totalJobs / this.perPage);

          // Compute and cache tag counts once
          this.tags.forEach(tag => {
            tag.count = this.jobs.filter(job => job.tags && job.tags.includes(tag.value)).length;
          });

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
    const selectedJobTypes = this.jobTypes.filter(j => j.selected).map(j => j.value);
    const selectedExperiences = this.experienceLevels.filter(e => e.selected).map(e => e.value);
    const selectedTags = this.tags.filter(tag => tag.selected).map(tag => tag.value);

    const params: any = {
      category: this.searchCategory,
      location: this.searchLocation.trim(),
      keyword: this.searchKeyword.trim(),
      sort: this.selectedSort,
      ...(selectedJobTypes.length ? { 'employment_type[]': selectedJobTypes } : {}),
      ...(selectedExperiences.length ? { 'experience_level[]': selectedExperiences } : {}),
      ...(selectedTags.length ? { 'tags[]': selectedTags } : {}),
    };

    // Only add salary params if currency is selected
    if (this.selectedCurrency) {
      params.currency = this.selectedCurrency;
      params.min_salary = this.salaryRange.min;
      params.max_salary = this.salaryRange.max;
    }

    // Send duration only if selected
    if (this.selectedPeriod) {
      params.salary_duration = this.selectedPeriod;
    }
    return params;
  }

  onSearch(): void {
    this.isSearching = true;
    this.currentPage = 1; // Reset to first page on new search
    localStorage.setItem(this.STORAGE_KEYS.page, '1'); // <--- Reset storage to 1

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

    // ✅ Toast UX
    this.authService.toastr.success('Search results updated 🔍', '', {
      timeOut: 2500,
      progressBar: true,
      positionClass: 'toast-bottom-center'
    });
  }

  onToggleSaveJob(job: any) {
    this.authService.toggleSaveJob(job);
  }

  toggleFilterModal(): void {
    this.showFilterModal = !this.showFilterModal;
  }

  applyFiltersAndToggleModal(): void {
    this.toggleFilterModal();
    this.applyFilters();
  }

  sortJobs() {
    this.currentPage = 1; // Reset to first page on sort change
    localStorage.setItem(this.STORAGE_KEYS.sort, this.selectedSort);

    // Rebuild params and fetch
    this.applyingFilters = true;
    this.fetchJobs(this.buildSearchAndFilterParams());

    // ✅ Toast UX
    this.authService.toastr.success('Sorted successfully 📊', '', {
      timeOut: 2500,
      progressBar: true,
      positionClass: 'toast-bottom-center'
    });
  }

  applyFilters(): void {
    this.applyingFilters = true;
    this.currentPage = 1; // Reset to first page on filter change
    localStorage.setItem(this.STORAGE_KEYS.page, '1'); // <--- Reset storage to 1
    // Show currency notice only if currency is selected and applied
    this.showCurrencyNotice = !!this.selectedCurrency;

    // Save filter states
    const filterState = {
      jobTypes: this.jobTypes,
      experienceLevels: this.experienceLevels,
      tags: this.tags.filter(tag => tag.selected).map(tag => tag.value),  // Save selected tag values
      currency: this.selectedCurrency,
      min_salary: this.salaryRange.min,
      max_salary: this.salaryRange.max,
      salary_duration: this.selectedPeriod
    };
    localStorage.setItem(this.STORAGE_KEYS.filterState, JSON.stringify(filterState));

    // Active filter badges
    this.activeFilters = [
      ...this.jobTypes.filter(j => j.selected).map(j => j.label),
      ...this.experienceLevels.filter(e => e.selected).map(e => e.label),
      ...this.tags.filter(t => t.selected).map(t => t.name),
    ];
    localStorage.setItem(this.STORAGE_KEYS.filters, JSON.stringify(this.activeFilters));

    // Fetch with filters, search and sort (backend handles tags now)
    this.fetchJobs(this.buildSearchAndFilterParams());

    // ✅ Toast UX
    this.authService.toastr.success('Filters applied successfully 🎯', '', {
      timeOut: 2500,
      progressBar: true,
      positionClass: 'toast-bottom-center'
    });
  }

  toggleJobType(type: any) {
    type.selected = !type.selected;
  }

  toggleExperience(exp: any) {
    exp.selected = !exp.selected;
  }

  toggleTag(tag: any) {
    tag.selected = !tag.selected;
  }

  resetFilters(clearSearch: boolean = false): void {
    this.currentPage = 1; // Reset to first page on reset
    localStorage.setItem(this.STORAGE_KEYS.page, '1'); // <--- Reset storage to 1
    // Reset all filter checkboxes
    this.jobTypes.forEach(t => t.selected = false);
    this.experienceLevels.forEach(e => e.selected = false);
    this.tags.forEach(tag => tag.selected = false);

    // Reset sort to default
    this.selectedSort = 'datePosted';
    localStorage.setItem(this.STORAGE_KEYS.sort, this.selectedSort);

    // Clear active filter badges
    this.activeFilters = [];

    // Remove saved filter data
    localStorage.removeItem(this.STORAGE_KEYS.filters);
    localStorage.removeItem(this.STORAGE_KEYS.filterState);

    // Reset salary filters
    this.selectedCurrency = null;
    this.salaryRange = { min: 0, max: 0 };
    this.selectedPeriod = null;
    this.showCurrencyNotice = false;  // Hide notice on full reset

    // 🧠 Only clear search form if user confirms or passes true
    if (clearSearch) {
      this.searchCategory = null;
      this.searchLocation = '';
      this.searchKeyword = '';
      localStorage.removeItem(this.STORAGE_KEYS.search);
    }

    // Fetch jobs again — respect current search values if not cleared
    this.fetchJobs(this.buildSearchAndFilterParams());

    // ✅ Toast UX
    this.authService.toastr.info('Filters cleared 🧹', '', {
      timeOut: 2500,
      progressBar: true,
      positionClass: 'toast-bottom-center'
    });
  }

  resetFiltersAndToggleModal(clearSearch: boolean = false): void {
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

  // NEW: Toggle show more tags
  toggleShowMoreTags() {
    this.showMoreTags = !this.showMoreTags;
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

    // Check if the filter is a tag
    const tag = this.tags.find(t => t.name === filter);
    if (tag) {
      tag.selected = false;
      this.applyFilters();
      return;
    }
  }

  resetCurrencyFilter() {
    this.selectedCurrency = null;
    this.salaryRange = { min: 0, max: 0 };
    this.selectedPeriod = null;
    this.showCurrencyNotice = false;  // Hide the notice
    this.applyFilters();  // Re-fetch without currency filter
  }

  // Update getVisibleTags (show first 12, or all if showMoreTags)
  getVisibleTags(): any[] {
    // Filter for relevant tags first (count > 0 or selected)
    const filtered = this.tags.filter(tag => tag.count > 0 || tag.selected);
    // Then slice if showMoreTags is false
    return this.showMoreTags ? filtered : filtered.slice(0, 12);
  }

  // Method to get count for experience levels
  getExperienceCount(experience: any): number {
    return this.jobs.filter(job => job.experience_level === experience.value).length;
  }

  // Method to get count for job types
  getJobTypeCount(jobType: any): number {
    return this.jobs.filter(job => job.employment_type === jobType.value).length;
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

  // Get max salary based on currency
  getMaxSalary(): number {
    if (!this.selectedCurrency) {
      return 5000000;  // Default cap when no currency selected
    }
    const caps = { 'NGN': 5000000, 'USD': 50000, 'GBP': 40000, 'EUR': 45000 };
    return caps[this.selectedCurrency] || 5000000;  // Fallback if currency not in caps
  }

  // Handle currency change: Reset range when null and update max
  onCurrencyChange() {
    if (this.selectedCurrency) {
      this.salaryRange = { min: 0, max: this.getMaxSalary() };
    } else {
      this.salaryRange = { min: 0, max: 0 };  // Empty when no currency
    }
  }

  // Handle salary slider changes (optional: ensure min < max)
  onSalaryChange() {
    if (this.salaryRange.min > this.salaryRange.max) {
      this.salaryRange.min = this.salaryRange.max;
    }
  }

  // Update selectPeriod to work with salary
  selectPeriod(period: string) {
    this.selectedPeriod = period;
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchJobs(this.buildSearchAndFilterParams());
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchJobs(this.buildSearchAndFilterParams());
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchJobs(this.buildSearchAndFilterParams());
    }
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getShowingText(): string {
    const start = (this.currentPage - 1) * this.perPage + 1;
    const end = Math.min(this.currentPage * this.perPage, this.totalJobs);
    return `Showing <strong>${start}</strong> to <strong>${end}</strong> of <strong>${this.totalJobs}</strong> jobs`;
  }
}