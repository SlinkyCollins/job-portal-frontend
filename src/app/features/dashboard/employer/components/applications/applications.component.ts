import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InitialsPipe } from '../../../../../core/pipes/initials.pipe';
import { FormsModule } from '@angular/forms'; // Import FormsModule for select binding

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule, InitialsPipe, FormsModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];
  isLoading = true;
  
  // FILTERS
  activeTab: string = 'all';       // Status Filter
  selectedJob: string = 'all';     // Job Title Filter

  // Modal State
  showPreviewModal = false;
  previewUrl: any = null;
  previewFileType: 'pdf' | 'doc' | 'unknown' = 'unknown';

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.isLoading = true;
    this.dashboardService.getApplications().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status) {
          this.applications = res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // --- GETTERS & HELPERS ---

  // 1. Get Unique Job Titles for the Dropdown
  get uniqueJobs(): string[] {
    // Creates a unique list of job titles from the applications array
    return [...new Set(this.applications.map(app => app.job_title))];
  }

  // 2. Master Filter Logic (Filters by BOTH Status and Job)
  get filteredApplications() {
    return this.applications.filter(app => {
      // Check Status Match
      const statusMatch = (this.activeTab === 'all') || (app.status === this.activeTab);
      // Check Job Match
      const jobMatch = (this.selectedJob === 'all') || (app.job_title === this.selectedJob);
      
      return statusMatch && jobMatch;
    });
  }

  // 3. Count Helper (Respects the *other* filter)
  // E.g. If I filter by "Senior Dev", the "Pending" tab count should only show Pending Senior Devs
  getCount(status: string): number {
    return this.applications.filter(app => {
      const statusMatch = (status === 'all') || (app.status === status);
      const jobMatch = (this.selectedJob === 'all') || (app.job_title === this.selectedJob);
      return statusMatch && jobMatch;
    }).length;
  }

  // --- ACTIONS ---

  // Called when user clicks a job title in the card
  filterBySpecificJob(jobTitle: string) {
    this.selectedJob = jobTitle;
    this.toastr.info(`Showing applications for ${jobTitle}`, 'Filter Applied');
  }

  clearJobFilter() {
    this.selectedJob = 'all';
  }

  updateStatus(appId: number, newStatus: string) {
    this.dashboardService.updateApplicationStatus(appId, newStatus).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success(`Candidate marked as ${newStatus}`);
          const app = this.applications.find(a => a.application_id === appId);
          if (app) app.status = newStatus;
        }
      },
      error: (err) => this.toastr.error(`${err}: Failed to update status`)
    });
  }

  openResumePreview(url: string) {
    if (!url || url.trim() === '') {
      this.toastr.warning('This candidate has not attached a resume.', 'No Resume Found');
      return;
    }

    const extension = url.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      this.previewFileType = 'pdf';
      this.previewUrl = url;
    }
    else if (['doc', 'docx'].includes(extension || '')) {
      this.previewFileType = 'doc';
      const googleViewer = `https://docs.google.com/gview?url=${url}&embedded=true`;
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleViewer);
    }
    else {
      window.open(url, '_blank');
      return;
    }

    this.showPreviewModal = true;
  }

  closePreview() {
    this.showPreviewModal = false;
    this.previewUrl = null;
  }
}