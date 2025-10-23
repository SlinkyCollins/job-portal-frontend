import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  isSelectOpen1 = false;
  isSelectOpen2 = false;
  public selectedFileName: string = 'No file chosen';
  searchLocation: string = '';
  searchCategory: number | null = null;
  searchKeyword: string = '';
  allCategories: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.restoreSearchState();
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

    // Normalize the "None" option → treat 0 as null
    const normalizedCategory = this.searchCategory === 0 ? null : this.searchCategory;

    const searchState = {
      category: normalizedCategory,
      location: this.searchLocation.trim(),
      keyword: this.searchKeyword.trim(),
    };
    localStorage.setItem('jobSearch', JSON.stringify(searchState));

    this.router.navigate(['/jobs']);

    // ✅ Toast UX
    this.authService.toastr.success('Search results updated 🔍', '', {
      timeOut: 2500,
      progressBar: true,
      positionClass: 'toast-bottom-center'
    });
  }

  toggleSelectOpen() {
    this.isSelectOpen1 = !this.isSelectOpen1;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => {
      this.allCategories = cats;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Basic validation (optional)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.authService.toastr.error('Please select a valid CV file (PDF or DOC).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.authService.toastr.error('File size must be less than 5MB.');
        return;
      }

      this.selectedFileName = file.name;  // This updates the binding
      this.authService.toastr.info(`"${file.name}" selected ✅`);

      this.authService.uploadCV(file).subscribe({
        next: (response) => {
          console.log('Upload response:', response);
          this.authService.toastr.success('CV uploaded successfully!');
          // Optional: Reset after success
          event.target.value = '';
          this.selectedFileName = 'No file chosen';
        },
        error: (err) => {
          console.error('CV upload error:', err);
          this.authService.toastr.error('CV upload failed. Please try again.');
        }
      });
    } else {
      this.selectedFileName = 'No file chosen';  // This updates the binding
    }
  }
}
