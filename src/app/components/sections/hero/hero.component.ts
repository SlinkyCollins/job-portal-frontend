import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(private http: HttpClient, private apiService: ApiServiceService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loadCategories();
    this.restoreSearchState();
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
