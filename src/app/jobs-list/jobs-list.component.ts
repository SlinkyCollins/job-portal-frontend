import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../components/sections/navbar/navbar.component';
import { FooterComponent } from '../components/sections/footer/footer.component';
import { FormsModule } from '@angular/forms';

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  jobType: 'Fulltime' | 'Part time' | 'Fixed-Price' | 'Freelance';
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
  salaryRange: { min: number; max: number; current: { min: number; max: number } };
  categories: string[];
  tags: string[];
}

@Component({
  selector: 'app-jobs-list',
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  standalone: true,
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent implements OnInit {
  Math = Math // Added to expose Math to the template
  jobs: Job[] = [
    {
      id: 1,
      title: 'Developer & expert in java c++',
      company: 'TechCorp',
      logo: '💻',
      jobType: 'Fulltime',
      salary: 900,
      salaryPeriod: 'Monthly',
      location: 'Spain, Barcelona',
      experience: 'Expert',
      category: 'Developer',
      tags: ['Java', 'C++']
    },
    {
      id: 2,
      title: 'Animator & Expert in maya 3D',
      company: 'CreativeStudio',
      logo: '🎨',
      jobType: 'Part time',
      salary: 100,
      salaryPeriod: 'Weekly',
      location: 'USA, New York',
      experience: 'Expert',
      category: 'Design',
      tags: ['Maya', '3D', 'Animation']
    },
    {
      id: 3,
      title: 'Marketing Specialist in SEO & SMM',
      company: 'MarketPro',
      logo: '📈',
      jobType: 'Part time',
      salary: 50,
      salaryPeriod: 'Hourly',
      location: 'USA, Alaska',
      experience: 'Intermediate',
      category: 'Marketing',
      tags: ['SEO', 'SMM', 'Marketing']
    },
    {
      id: 4,
      title: 'Developer & Expert in javascript c+',
      company: 'WebSolutions',
      logo: '🚀',
      jobType: 'Fulltime',
      salary: 800,
      salaryPeriod: 'Monthly',
      location: 'USA, California',
      experience: 'Expert',
      category: 'Developer',
      tags: ['JavaScript', 'C++']
    },
    {
      id: 5,
      title: 'Lead & Product Designer',
      company: 'DesignHub',
      logo: '🎯',
      jobType: 'Fulltime',
      salary: 1200,
      salaryPeriod: 'Monthly',
      location: 'UK, London',
      experience: 'Expert',
      category: 'Design',
      tags: ['Product Design', 'Leadership']
    },
    {
      id: 6,
      title: 'Web Developer',
      company: 'WebCraft',
      logo: '🌐',
      jobType: 'Fixed-Price',
      salary: 1500,
      salaryPeriod: 'Monthly',
      location: 'USA, Mountain View',
      experience: 'Intermediate',
      category: 'Developer',
      tags: ['Web Development', 'Frontend']
    },
    {
      id: 7,
      title: 'Data Scientist',
      company: 'DataTech',
      logo: '📊',
      jobType: 'Freelance',
      salary: 2500,
      salaryPeriod: 'Weekly',
      location: 'Germany, Berlin',
      experience: 'Expert',
      category: 'Data Science',
      tags: ['Python', 'Machine Learning']
    },
    {
      id: 8,
      title: 'UX/UI Designer',
      company: 'UserFirst',
      logo: '🎨',
      jobType: 'Fulltime',
      salary: 1800,
      salaryPeriod: 'Monthly',
      location: 'USA, Cupertino',
      experience: 'Intermediate',
      category: 'Design',
      tags: ['UX', 'UI', 'Figma']
    }
  ];

  filteredJobs: Job[] = [];
  activeFilters: string[] = [];
  showFilterModal = false;
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;
  searchLocation = 'Spain, Barcelona';
  searchCategory = 'Developer';
  sortBy = 'Price Short';

  filterOptions: FilterOptions = {
    jobTypes: [
      { name: 'Fulltime', count: 12, selected: false },
      { name: 'Part time', count: 8, selected: false },
      { name: 'Fixed-Price', count: 4, selected: false },
      { name: 'Freelance', count: 4, selected: false }
    ],
    experiences: [
      { name: 'Fresher', count: 6, selected: false },
      { name: 'Intermediate', count: 4, selected: false },
      { name: 'No-Experience', count: 6, selected: false },
      { name: 'Internship', count: 6, selected: false },
      { name: 'Expert', count: 6, selected: false }
    ],
    salaryRange: {
      min: 0,
      max: 3500,
      current: { min: 0, max: 3500 }
    },
    categories: ['Developer', 'Design', 'Marketing', 'Data Science'],
    tags: ['Java', 'C++', 'JavaScript', 'Python', 'React', 'Angular']
  };

  ngOnInit(): void {
    this.applyFilters();
  }

  toggleFilterModal(): void {
    this.showFilterModal = !this.showFilterModal;
  }

  toggleJobTypeFilter(jobType: string): void {
    const filter = this.filterOptions.jobTypes.find(jt => jt.name === jobType);
    if (filter) {
      filter.selected = !filter.selected;
      this.updateActiveFilters();
      this.applyFilters();
    }
  }

  toggleExperienceFilter(experience: string): void {
    const filter = this.filterOptions.experiences.find(exp => exp.name === experience);
    if (filter) {
      filter.selected = !filter.selected;
      this.updateActiveFilters();
      this.applyFilters();
    }
  }

  updateActiveFilters(): void {
    this.activeFilters = [];
    
    // Add selected job types
    this.filterOptions.jobTypes
      .filter(jt => jt.selected)
      .forEach(jt => this.activeFilters.push(jt.name));
    
    // Add selected experiences
    this.filterOptions.experiences
      .filter(exp => exp.selected)
      .forEach(exp => this.activeFilters.push(exp.name));
  }

  removeFilter(filter: string): void {
    // Remove from job types
    const jobTypeFilter = this.filterOptions.jobTypes.find(jt => jt.name === filter);
    if (jobTypeFilter) {
      jobTypeFilter.selected = false;
    }
    
    // Remove from experiences
    const experienceFilter = this.filterOptions.experiences.find(exp => exp.name === filter);
    if (experienceFilter) {
      experienceFilter.selected = false;
    }
    
    this.updateActiveFilters();
    this.applyFilters();
  }

  resetFilters(): void {
    this.filterOptions.jobTypes.forEach(jt => jt.selected = false);
    this.filterOptions.experiences.forEach(exp => exp.selected = false);
    this.filterOptions.salaryRange.current = { ...this.filterOptions.salaryRange };
    this.activeFilters = [];
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.jobs];
    
    // Apply job type filters
    const selectedJobTypes = this.filterOptions.jobTypes
      .filter(jt => jt.selected)
      .map(jt => jt.name);
    
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter(job => selectedJobTypes.includes(job.jobType));
    }
    
    // Apply experience filters
    const selectedExperiences = this.filterOptions.experiences
      .filter(exp => exp.selected)
      .map(exp => exp.name);
    
    if (selectedExperiences.length > 0) {
      filtered = filtered.filter(job => selectedExperiences.includes(job.experience));
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
      'Fulltime': 'badge-fulltime',
      'Part time': 'badge-parttime',
      'Fixed-Price': 'badge-fixed',
      'Freelance': 'badge-freelance'
    };
    return classes[jobType] || 'badge-default';
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}