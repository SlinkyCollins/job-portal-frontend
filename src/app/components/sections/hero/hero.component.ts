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
  public uploadedCV: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.restoreSearchState();
    // Restore uploaded CV from localStorage
    this.uploadedCV = localStorage.getItem('user_cv') || '';
    if (this.uploadedCV) {
      this.selectedFileName = 'CV Uploaded'; // Or fetch filename from backend
    }
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
      this.uploadFile(file);
    } else {
      this.selectedFileName = 'No file chosen';
    }
  }

  uploadFile(file: File) {
    this.isUploading = true;
    this.uploadProgress = 0;
    this.authService.uploadCV(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          // This is the real-time progress calculation
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          const res = event.body;
          if (res.status) {
            this.authService.toastr.success('CV uploaded successfully ✅');
            this.uploadedCV = res.url; // 'res.url' from your backend
            this.selectedFileName = file.name; // Set filename on success
            localStorage.setItem('user_cv', res.url);
          } else {
            this.authService.toastr.error(res.message);
          }
          this.isUploading = false; // Hide progress bar
        }
      },
      error: (err) => {
        console.error('CV upload error:', err);
        this.authService.toastr.error('CV upload failed. Please try again.');
        this.isUploading = false; // Hide progress bar on error
        this.uploadProgress = 0;
        this.selectedFileName = this.uploadedCV ? 'Your CV' : 'No file chosen';
      },
    });
  }

  deleteCV() {
    // Optional: Add a confirmation dialog
    if (!confirm('Are you sure you want to delete your CV?')) {
      return;
    }

    // this.authService.deleteCV().subscribe({
    //   next: () => {
    //     this.authService.toastr.success('CV deleted successfully!');
    //     this.uploadedCV = '';
    //     this.selectedFileName = 'No file chosen';
    //     localStorage.removeItem('user_cv');
    //   },
    //   error: (err) => {
    //     console.error('Delete error:', err);
    //     this.authService.toastr.error(
    //       'Failed to delete CV. Please try again.'
    //     );
    //   },
    // });
  }
}