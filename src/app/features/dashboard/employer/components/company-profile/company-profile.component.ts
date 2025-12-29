import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  companyForm: FormGroup;
  isLoading = false;
  isSaving = false;
  logoPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      location: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]]
    });
  }

  ngOnInit(): void {
    this.loadCompanyProfile();
  }

  loadCompanyProfile() {
    this.isLoading = true;
    this.dashboardService.getCompanyProfile().subscribe({
      next: (res: any) => {
        if (res.status && res.data) {
          this.companyForm.patchValue({
            name: res.data.name,
            website: res.data.website,
            location: res.data.location,
            description: res.data.description
          });
          if (res.data.logo_url) {
            this.logoPreview = res.data.logo_url;
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        this.toastr.error('Only PNG, JPG, and JPEG files are allowed.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.toastr.error('File size should not exceed 2MB.');
        return;
      }

      this.selectedFile = file;

      // Mark the form as dirty so the Save button enables
      this.companyForm.markAsDirty();

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }

    this.isSaving = true;
    const formData = new FormData();

    // Append form values
    Object.keys(this.companyForm.value).forEach(key => {
      formData.append(key, this.companyForm.value[key]);
    });

    // Append logo if selected
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    this.dashboardService.saveCompanyProfile(formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success('Company profile saved successfully!');
          this.companyForm.markAsPristine();
          // Refresh user data to update hasCompany reactively
          this.authService.getEmployerData().subscribe({
            error: (err) => {
              console.error('Error refreshing user data:', err);
            }
          });
        } else {
          this.toastr.error(res.message || 'Failed to save profile.');
        }
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error saving profile', err);
        this.toastr.error('An error occurred while saving.');
        this.isSaving = false;
      }
    });
  }
}
