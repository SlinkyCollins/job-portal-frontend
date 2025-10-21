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
    private http: HttpClient,
    private apiService: ApiServiceService,
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
      this.selectedFileName = file.name;
      document.getElementById("fileName")!.textContent = file.name;
    } else {
      this.selectedFileName = 'No file chosen';
      document.getElementById("fileName")!.textContent = 'No file chosen';
    }
  }
}
