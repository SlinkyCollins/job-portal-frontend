import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ProfileService } from '../../../../../core/services/profile.service';
import { InitialsPipe } from '../../../../../core/pipes/initials.pipe';
import { COUNTRIES } from '../../../../../core/constants/countries';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    CommonModule,
    InitialsPipe
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  photoURL: string = '';
  user: any = {};
  isSaving: boolean = false;
  isUploading: boolean = false;
  isDeleting: boolean = false;
  isLoading: boolean = true;
  completionPercentage: number = 0;
  isAlertDismissed: boolean = false;
  readonly countries = COUNTRIES;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize form early with defaults
    this.profileForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/\s/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/), Validators.maxLength(15)]],
      bio: [''],
      address: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isAlertDismissed = false;
    this.loadProfile();
    this.profileService.completion$.subscribe(percentage => {
      this.completionPercentage = percentage;
    });
    this.profileService.initials$.subscribe(initials => {
      this.user.firstname = initials.firstname;
      this.user.lastname = initials.lastname;
    });
  }

  dismissAlert(): void {
    this.isAlertDismissed = true;
  }

  loadProfile(): void {
    this.isLoading = true;
    this.dashboardService.getSeekerProfile().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.user = response.profile;
          this.photoURL = this.user.profile_pic_url || '';
          // Update form with loaded data
          this.profileForm.patchValue({
            fullname: this.user.fullname || '',
            phone: this.user.phone || '',
            bio: this.user.bio || '',
            address: this.user.address || '',
            country: this.user.country || ''
          });
          this.cdr.detectChanges();  // Force change detection
        }
        this.isLoading = false;
        this.cdr.detectChanges();  // Ensure UI updates
      },
      error: (err) => {
        console.error('loadProfile: Error, err:', err);
        this.isLoading = false;
        this.cdr.detectChanges();  // Ensure UI updates
        this.authService.toastr.error('Failed to load profile. Please refresh.');
      }
    });
  }

  onUploadPhoto(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.dashboardService.uploadProfilePhoto(file).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.photoURL = response.photoURL;  // Update from backend
            const firstname = this.user.fullname?.split(' ')[0] || '';
            // Emit to service
            this.profileService.updateProfile(this.photoURL, firstname);
            this.authService.toastr.success('Profile photo updated successfully');
          }
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.authService.toastr.error('Failed to upload profile photo:', err.message);
          this.isUploading = false;
        }
      });
    }
  }

  confirmDeletePhoto(): void {
    this.isDeleting = true;
    this.dashboardService.deleteProfilePhoto().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.photoURL = '';  // Revert to default
          const firstname = this.user.fullname.split(' ')[0];
          this.profileService.updateProfile('', firstname);
          this.authService.toastr.success('Profile photo deleted successfully');
        }
        this.isDeleting = false;
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.authService.toastr.error('Failed to delete photo');
        this.isDeleting = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.dashboardService.updateProfile(this.profileForm.value).subscribe({
        next: (response: any) => {
          if (response.status) {
            // Update local user data
            this.user.fullname = this.profileForm.value.fullname;
            const firstname = this.user.fullname.split(' ')[0];  // Get first part
            // Emit to service
            this.profileService.updateProfile(this.photoURL, firstname);
            this.profileService.updateInitials(this.user.fullname.split(' ')[0], this.user.fullname.split(' ')[1] || '');

            // Merge the form values into the existing user object to get the latest state
            const updatedProfile = { ...this.user, ...this.profileForm.value };

            // Trigger recalculation
            this.profileService.updateCompletionScore(updatedProfile);

            this.authService.toastr.success('Profile updated successfully');

            // Mark form as pristine after successful save
            this.profileForm.markAsPristine();
          }
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Save failed:', err);
          this.authService.toastr.error('Failed to update profile, please try again.');
          this.isSaving = false;
        }
      });
    }
  }

  onReset(): void {
    this.profileForm.patchValue({
      fullname: this.user.fullname || '',
      phone: this.user.phone || '',
      bio: this.user.bio || '',
      address: this.user.address || '',
      country: this.user.country || ''
    });
  }
}
