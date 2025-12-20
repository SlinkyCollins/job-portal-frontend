import { CommonModule } from "@angular/common"
import { ChangeDetectorRef, Component, NgZone, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule, type AbstractControl, ValidationErrors } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { AuthService } from "../../../../../core/services/auth.service"
import { ProfileService } from "../../../../../core/services/profile.service"
import { DashboardService } from "../../../../../core/services/dashboard.service"
import { Auth, FacebookAuthProvider, linkWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: "app-accountsettings",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./accountsettings.component.html",
  styleUrls: ["./accountsettings.component.css"],
})
export class AccountsettingsComponent implements OnInit {
  profileForm!: FormGroup
  passwordForm!: FormGroup

  // Password visibility toggles
  showOldPassword = false
  showNewPassword = false
  showConfirmPassword = false

  // Loading states
  isLoading = false
  isProfileSaving = false
  isPasswordSaving = false
  isSocialLogin = false

  showLinkFacebook: boolean = false;
  showLinkGoogle: boolean = false;
  isGoogleLinked: boolean = false;
  isLinkingGoogle: boolean = false;
  isFacebookLinked: boolean = false;
  isLinkingFacebook: boolean = false;

  linkedProviders: string[] = [];

  isVerifyingOldPassword: boolean = false;
  oldPasswordVerified: boolean = false;
  public showDeleteModal: boolean = false;
  public deleteConfirmationText: string = '';
  public isDeletingAccount: boolean = false;

  user: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private auth: Auth,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  // Custom validator for new password not same as old
  newPasswordNotOldValidator(control: AbstractControl): ValidationErrors | null {
    const oldPassword = control.get('oldPassword');
    const newPassword = control.get('newPassword');
    // Only check if both have values and are the same
    if (oldPassword && newPassword && oldPassword.value && newPassword.value && oldPassword.value === newPassword.value) {
      newPassword.setErrors({ sameAsOld: true })
      return { sameAsOld: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserProfile();
  }

  private initializeForms(): void {
    // Profile form
    this.profileForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: [{ value: "", disabled: true }]
    })

    // Password form with custom validator
    this.passwordForm = this.fb.group(
      {
        oldPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: [this.passwordMatchValidator, this.newPasswordNotOldValidator] }
    )
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.dashboardService.getSettings().subscribe({
      next: (response: any) => {
        console.log(response);
        this.user = response.data;

        // Handle Social Providers
        if (this.user.linked_providers) {
          try {
            this.linkedProviders = typeof this.user.linked_providers === 'string'
              ? JSON.parse(this.user.linked_providers)
              : this.user.linked_providers;
          } catch (e) {
            console.error('Error parsing linked_providers', e);
          }
        }
        this.checkSocialLinked();

        // Patch Form
        this.profileForm.patchValue({
          firstName: this.user.firstname,
          lastName: this.user.lastname,
          email: this.user.email
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('loadUserProfile: Error, err:', err);
        this.isLoading = false;
      }
    });
  }

  // Method to verify old password
  verifyOldPassword(): void {
    const oldPassword = this.passwordForm.get('oldPassword')?.value;
    if (!oldPassword) return;
    this.isVerifyingOldPassword = true;
    this.authService.verifyOldPassword(oldPassword).subscribe({
      next: (response) => {
        if (response.status) {
          this.oldPasswordVerified = true;
          this.authService.toastr.success('Old password verified!');
        } else {
          this.oldPasswordVerified = false;
          this.authService.toastr.error('Old password is incorrect.');
        }
        this.isVerifyingOldPassword = false;
      },
      error: () => {
        this.oldPasswordVerified = false;
        this.authService.toastr.error('Verification failed.');
        this.isVerifyingOldPassword = false;
      }
    });
  }

  toggleOldPassword(): void {
    this.showOldPassword = !this.showOldPassword
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  // UPDATED: Use generic endpoint
  onSaveProfile(): void {
    if (this.profileForm.valid) {
      this.isProfileSaving = true;
      const formData = this.profileForm.getRawValue();

      this.authService.updateAccountSettings(formData).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toastr.success('Account updated successfully!');
            this.user = { ...this.user, ...formData };

            // Update global profile state (Header name, etc)
            const currentProfile = this.profileService.profileSubject.getValue();
            this.profileService.updateProfile(currentProfile.photoURL, formData.firstName);
            this.profileService.updateInitials(formData.firstName, formData.lastName);

            this.profileForm.markAsPristine();
          } else {
            this.toastr.error(response.msg || 'Update failed');
          }
          this.isProfileSaving = false;
        },
        error: (err) => {
          this.toastr.error(err.error?.msg || 'Update failed');
          this.isProfileSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  onCancelProfile(): void {
    this.profileForm.patchValue({
      firstName: this.user.firstname || '',
      lastName: this.user.lastname || '',
      email: this.user.email || ''
    });
    this.profileForm.markAsPristine();
  }

  // Custom validator for password confirmation
  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get("newPassword")
    const confirmPassword = control.get("confirmPassword")

    if (!newPassword || !confirmPassword) {
      return null
    }

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  onChangePassword(): void {
    if (!this.oldPasswordVerified) {
      this.authService.toastr.warning('Please verify your old password first.');
      return;
    }
    if (this.passwordForm.valid) {
      this.isPasswordSaving = true;
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.authService.changePassword(oldPassword, newPassword).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.authService.toastr.success('Password updated successfully!');
            this.passwordForm.reset();
            this.oldPasswordVerified = false;  // Reset verification only on success for next change
          } else {
            this.authService.toastr.error(response.message || 'Failed to update password. Please check your inputs.');
          }
          this.isPasswordSaving = false;
        },
        error: (err) => {
          console.error('Password update error:', err);  // Detailed logging for dev
          this.authService.toastr.error('An error occurred while updating password. Please try again later.');
          this.isPasswordSaving = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm)
    }
  }

  // Helper method to mark all fields as touched for validation display
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key)
      control?.markAsTouched()
    })
  }

  // Delete Account Modal Methods
  openDeleteModal() {
    this.showDeleteModal = true;
    this.deleteConfirmationText = ''; // Reset input
  }

  // UPDATED: Use generic endpoint
  handleAccountDeletion() {
    if (this.deleteConfirmationText !== 'DELETE') return;

    this.isDeletingAccount = true;
    const param = { confirmation: this.deleteConfirmationText };

    this.dashboardService.deleteAccount(param).subscribe({
      next: (response) => {
        if (response.status) {
          this.toastr.success('Account deleted successfully');
          this.showDeleteModal = false;
          localStorage.removeItem('user');
          this.authService.logout();
        } else {
          this.toastr.error(response.message || 'Failed to delete account');
          this.isDeletingAccount = false;
        }
      },
      error: (err) => {
        this.toastr.error('Error deleting account');
        this.isDeletingAccount = false;
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteConfirmationText = '';
  }

  onDeleteInputChange(event: Event) {
    this.deleteConfirmationText = (event.target as HTMLInputElement).value;
  }

  getProviderDisplayName(providerId: string): string {
    const icons: { [key: string]: string } = {
      'google.com': '<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" class="me-2">',
      'facebook.com': '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/32px-Facebook_f_logo_%282019%29.svg.png" alt="Facebook" width="20" height="20" class="me-2">'
    };
    return icons[providerId] || providerId;  // Fallback to ID if unknown
  }

  checkSocialLinked(): void {
    this.isFacebookLinked = this.linkedProviders.includes('facebook.com');
    this.isGoogleLinked = this.linkedProviders.includes('google.com');

    // Determine which button to show
    this.showLinkFacebook = this.isGoogleLinked && !this.isFacebookLinked;  // Show if Google linked but Facebook not
    this.showLinkGoogle = this.isFacebookLinked && !this.isGoogleLinked;    // Show if Facebook linked but Google not
  }

  saveLinkedProviders(): void {
    const data = { linked_providers: JSON.stringify(this.linkedProviders) };
    this.dashboardService.updateProfile(data).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.authService.toastr.success('Linked providers updated successfully');
        }
      },
      error: (err) => {
        console.error('Error saving linked providers:', err);
        this.authService.toastr.error('Failed to update linked providers');
      }
    });
  }

  private handleLinkError(error: any): void {
    if (error.code === 'auth/credential-already-in-use') {
      this.authService.toastr.error('This account is already linked to another user.');
    } else if (error.code === 'auth/popup-blocked') {
      this.authService.toastr.error('Popup blocked. Please allow popups and try again.');
    } else {
      this.authService.toastr.error('Failed to link account.');
      console.error('Linking error:', error);
    }
  }

  linkGoogle(): void {
    if (!this.auth.currentUser) {
      this.authService.toastr.error('Please log in first.');
      return;
    }
    this.isLinkingGoogle = true;
    const provider = new GoogleAuthProvider();
    this.ngZone.run(() =>
      linkWithPopup(this.auth.currentUser!, provider)
        .then(async (result) => {
          await this.auth.currentUser?.reload();
          // Update local linkedProviders from Firebase after reload
          this.linkedProviders = this.auth.currentUser?.providerData.map(p => p.providerId) || [];
          this.isLinkingGoogle = false;
          this.authService.toastr.success('Google account linked successfully!');
          this.checkSocialLinked();
          this.saveLinkedProviders();
        }).catch((error) => {
          this.isLinkingGoogle = false;
          this.handleLinkError(error);
        })
    );
  }

  linkFacebook(): void {
    // Detect mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      this.authService.toastr.warning('Facebook linking is not supported on mobile devices. Please use a desktop browser.');
      return;
    }
    if (!this.auth.currentUser) {
      this.authService.toastr.error('Please log in first.');
      return;
    }
    this.isLinkingFacebook = true;
    const provider = new FacebookAuthProvider();
    this.ngZone.run(() =>
      linkWithPopup(this.auth.currentUser!, provider)
        .then(async (result) => {
          await this.auth.currentUser?.reload();  // Refresh user data
          // Update local linkedProviders from Firebase after reload
          this.linkedProviders = this.auth.currentUser?.providerData.map(p => p.providerId) || [];
          console.log('Linked providers after reload:', this.auth.currentUser?.providerData);
          this.isLinkingFacebook = false;
          this.authService.toastr.success('Facebook account linked successfully!');
          this.checkSocialLinked();
          // Save to DB immediately
          this.saveLinkedProviders();
        }).catch((error) => {
          this.isLinkingFacebook = false;
          this.handleLinkError(error);
        })
    );
  }
}

