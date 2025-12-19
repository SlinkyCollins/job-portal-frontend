import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { InitialsPipe } from '../../../../../core/pipes/initials.pipe';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule, InitialsPipe],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];
  isLoading = true;
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

  updateStatus(appId: number, newStatus: string) {
    this.dashboardService.updateApplicationStatus(appId, newStatus).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success(`Candidate marked as ${newStatus}`);
          // Update UI locally
          const app = this.applications.find(a => a.application_id === appId);
          if (app) app.status = newStatus;
        }
      },
      error: (err) => this.toastr.error(`${err}: Failed to update status`)
    });
  }

  openResumePreview(url: string) {
    // 1. Check if URL is null, undefined, or empty string
    if (!url || url.trim() === '') {
      this.toastr.warning('This candidate has not attached a resume.', 'No Resume Found');
      return; // Stop here. Do not open the modal.
    }

    const extension = url.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      this.previewFileType = 'pdf';
      // For ngx-extended-pdf-viewer, we pass the raw string URL, NOT the sanitized one
      this.previewUrl = url;
    }
    else if (['doc', 'docx'].includes(extension || '')) {
      this.previewFileType = 'doc';
      // Use Google Docs Viewer for Word files
      const googleViewer = `https://docs.google.com/gview?url=${url}&embedded=true`;
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleViewer);
    }
    else {
      // Fallback: Just open in new tab
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