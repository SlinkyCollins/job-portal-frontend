import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ProfileService } from '../../../../../core/services/profile.service';

@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employer-profile.component.html'
})
export class EmployerProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = true;
  isSaving = false;

  selectedFile: File | null = null;
  profilePicUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dashboardService: DashboardService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      employer_role: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.dashboardService.getEmployerProfile().subscribe({
      next: (res) => {
        if (res.status) {
          this.profileForm.patchValue(res.data);
          this.profilePicUrl = res.data.profile_pic_url || null;
          this.profileService.updateEmployerProfile(this.profilePicUrl || '', this.profileForm.get('firstname')?.value || '');
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load profile');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadPhoto();
    }
  }

  // UPDATED: Use DashboardService for Shared Endpoint
  uploadPhoto() {
    if (!this.selectedFile) return;

    this.isSaving = true;

    // Use the shared service method
    this.dashboardService.uploadProfilePhoto(this.selectedFile).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.status) {
          this.profilePicUrl = res.photoURL;
          this.profileService.updateEmployerProfile(this.profilePicUrl || '', this.profileForm.get('firstname')?.value || '');
          this.toastr.success('Profile photo updated');
        } else {
          this.toastr.error(res.message || 'Upload failed');
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.toastr.error('Photo upload failed');
        console.error(err);
      }
    });
  }

  deletePhoto(event: Event) {
    event.stopPropagation(); // Prevent triggering the file input click
    if (!confirm('Are you sure you want to remove your photo?')) return;

    this.isSaving = true;
    this.dashboardService.deleteProfilePhoto().subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.status) {
          this.profilePicUrl = null; // Clear view
          this.profileService.updateEmployerProfile('', this.profileForm.get('firstname')?.value || '');
          this.toastr.success('Photo removed');
        }
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Could not delete photo');
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    this.dashboardService.updateEmployerProfile(this.profileForm.value)
      .subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.status) {
            this.profileService.updateEmployerProfile(this.profilePicUrl || '', this.profileForm.get('firstname')?.value || '');
            this.toastr.success('Profile updated successfully');
            this.profileForm.markAsPristine();
          } else {
            this.toastr.error(res.message);
          }
        },
        error: () => {
          this.isSaving = false;
          this.toastr.error('Update failed');
        }
      });
  }

  getInitials(): string {
    const f = this.profileForm.get('firstname')?.value || '';
    const l = this.profileForm.get('lastname')?.value || '';
    return (f.charAt(0) + l.charAt(0)).toUpperCase();
  }
}