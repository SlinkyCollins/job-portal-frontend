import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit {
  isSelectOpen = false;
  searchLocation: string = '';
  searchCategory: number | null = null;
  searchKeyword: string = '';
  allCategories: any[] = [];
  public selectedFileName: string = 'No file chosen';
  public uploadProgress: number = 0;
  public isUploading: boolean = false;
  public uploadedCV: string = ''; // Now tied to profile data
  public profileData: any[] = [];
  public showDeleteModal: boolean = false;  // For delete confirmation modal
  public isDeleting: boolean = false;  // For delete modal loading
  public isRefetching: boolean = false;  // For post-upload refetch

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.loadSeekerProfile(); // Always try to load profile; interceptor handles 401 without redirect
    this.loadCategories();
    this.restoreSearchState();
  }

  loadSeekerProfile() {
    this.isRefetching = true;  // Disable button during fetch
    this.authService.getSeekerProfile().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.profileData = response.profile;
          this.uploadedCV = response.profile.cv_url || '';
          // Use cv_filename from backend instead of extracting from URL
          this.selectedFileName = response.profile.cv_filename || 'No file chosen';
          // console.log('Profile loaded:', response);
        }
        this.isDeleting = false;
        this.isRefetching = false;  // Hide refetch loader
      },
      error: (err) => {
        this.isRefetching = false; 
        this.isDeleting = false;
        // console.error('Failed to fetch profile:', err);
        this.uploadedCV = '';
        this.selectedFileName = 'No file chosen';
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserRole(): string | null {
    return this.authService.getUserRole();
  }

  clearLocation() {
    this.searchLocation = '';
  }

  clearKeyword() {
    this.searchKeyword = '';
  }

  restoreSearchState() {
    const savedState = localStorage.getItem('jobSearch');
    if (savedState) {
      const { category, location, keyword } = JSON.parse(savedState);
      this.searchCategory = category;
      this.searchLocation = location;
      this.searchKeyword = keyword;
    }
  }

  onSearch(): void {
    const normalizedCategory = this.searchCategory === 0 ? null : this.searchCategory;
    const searchState = {
      category: normalizedCategory,
      location: this.searchLocation.trim(),
      keyword: this.searchKeyword.trim(),
    };
    localStorage.setItem('jobSearch', JSON.stringify(searchState));
    this.router.navigate(['/jobs']);
    this.authService.toastr.success('Search results updated 🔍', '', {
      timeOut: 2500,
      progressBar: true,
      positionClass: 'toast-bottom-center'
    });
  }

  toggleSelectOpen() {
    this.isSelectOpen = !this.isSelectOpen;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => {
      this.allCategories = cats;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!this.authService.isLoggedIn()) {
        this.authService.toastr.error('You must be logged in to upload a CV.');
        this.router.navigate(['/login']);
        return;
      }
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.authService.toastr.error(
          'Please select a valid CV file (PDF, DOC, or DOCX).'
        );
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        this.authService.toastr.error('File size must be less than 10MB.');
        return;
      }
      this.selectedFileName = file.name;
      this.authService.toastr.info(`"${file.name}" selected ✅`);
      this.uploadFile(file, this.selectedFileName);
    } else {
      this.selectedFileName = 'No file chosen';
    }
  }

  uploadFile(file: File, filename: string) {
    this.isUploading = true;
    this.uploadProgress = 0;
    // Pass the original filename to the service (update AuthService.uploadCV to accept it)
    this.authService.uploadCV(file, filename).subscribe({  // Assuming you modify the service
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          const res = event.body;
          if (res.status) {
            this.authService.toastr.success('CV uploaded successfully ✅');
            this.isRefetching = true;  // Show refetch loader
            // Refetch profile to sync uploadedCV and filename with backend
            this.loadSeekerProfile();
          } else {
            this.authService.toastr.error(res.message);
          }
          this.isUploading = false;
        }
      },
      error: (err) => {
        console.error('CV upload error:', err);
        this.authService.toastr.error('CV upload failed. Please try again.');
        this.isUploading = false;
        this.uploadProgress = 0;
        this.selectedFileName = this.uploadedCV ? 'Your CV' : 'No file chosen';
      },
    });
  }

  deleteCV() {
    // Remove the confirm() call; use the modal instead
    this.openDeleteModal();
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    this.isDeleting = true;
    this.authService.deleteCV().subscribe({
      next: () => {
        this.closeDeleteModal();
        this.authService.toastr.success('CV deleted successfully!');
        this.loadSeekerProfile();  // Refetch to hide filename and show upload button
      },
      error: (err) => {
        this.authService.toastr.error('Failed to delete CV. Please try again.');
        this.closeDeleteModal();
        this.isDeleting = false;
      }
    });
  }
}