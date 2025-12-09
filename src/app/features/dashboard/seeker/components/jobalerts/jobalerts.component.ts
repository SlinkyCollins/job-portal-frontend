import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface JobAlert {
  id: number;
  title: string;
  type: 'Fulltime' | 'Part-Time';
  salary: string;
  location: string;
  categories: string;
  jobsFound: string;
  frequency: string;
}

@Component({
  selector: 'app-jobalerts',
  imports: [CommonModule],
  templateUrl: './jobalerts.component.html',
  styleUrl: './jobalerts.component.css'
})
export class JobalertsComponent {
  
  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 7;
  visiblePages: number[] = [1, 2, 3];
  showEllipsis: boolean = true;
  
  // Job alerts data matching the screenshots
  alerts: JobAlert[] = [
    {
      id: 1,
      title: 'Product Designer',
      type: 'Fulltime',
      salary: 'Yearly Salary',
      location: 'Germany',
      categories: 'Design, Product',
      jobsFound: 'Jobs found 2',
      frequency: 'Weekly'
    },
    {
      id: 2,
      title: 'Marketing',
      type: 'Part-Time',
      salary: 'Weekly Salary',
      location: 'United Kingdom',
      categories: 'Account, Marketing',
      jobsFound: 'Jobs found 13',
      frequency: 'Monthly'
    },
    {
      id: 3,
      title: 'Hotel Manager',
      type: 'Fulltime',
      salary: 'Yearly Salary',
      location: 'Germany',
      categories: 'Design, Product',
      jobsFound: 'Jobs found 7',
      frequency: 'Daily'
    },
    {
      id: 4,
      title: 'Developer',
      type: 'Fulltime',
      salary: 'Monthly Salary',
      location: 'United States',
      categories: 'Account, Finance',
      jobsFound: 'Jobs found 3',
      frequency: 'Weekly'
    },
    {
      id: 5,
      title: 'Account Manager',
      type: 'Part-Time',
      salary: 'Hourly Salary',
      location: 'Spain',
      categories: 'Account, Finance',
      jobsFound: 'Jobs found 9',
      frequency: 'Monthly'
    }
  ];
  
  constructor() {
    this.updateVisiblePages();
  }
  
  // Get CSS class for alert type styling
  getAlertTypeClass(type: string): string {
    return type === 'Fulltime' ? 'alert-fulltime' : 'alert-parttime';
  }
  
  // Handle pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updateVisiblePages();
      // Add your page change logic here
    }
  }
  
  private updateVisiblePages(): void {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 1);
    const end = Math.min(this.totalPages, start + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    this.visiblePages = pages;
    this.showEllipsis = end < this.totalPages - 1;
  }
}