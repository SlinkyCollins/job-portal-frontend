import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule, type AbstractControl } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-accountsettings",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./accountsettings.component.html",
  styleUrl: "./accountsettings.component.css",
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

  user: any = {};

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserProfile();
  }

  private initializeForms(): void {
    // Profile form
    this.profileForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required]]
    })

    // Password form with custom validator
    this.passwordForm = this.fb.group(
      {
        oldPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getSeekerProfile().subscribe({
      next: (response: any) => {
        console.log(response);
        this.user = response.profile || {};

        // Check for social login via linked_providers
        let providers: string[] = [];
        if (this.user.linked_providers) {
          try {
            providers = typeof this.user.linked_providers === 'string'
              ? JSON.parse(this.user.linked_providers)
              : this.user.linked_providers;
          } catch (e) {
            console.error('Error parsing linked_providers', e);
          }
        }

        if (providers && providers.length > 0) {
          this.isSocialLogin = true;
          this.profileForm.get('email')?.disable();
        }

        if (response.status) {
          this.profileForm.patchValue({
            firstName: this.user.firstname || '',
            lastName: this.user.lastname || '',
            email: this.user.email || '',
            phoneNumber: this.user.phone || ''
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('loadUserProfile: Error, err:', err);
        this.isLoading = false;
      }
    });
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

  toggleOldPassword(): void {
    this.showOldPassword = !this.showOldPassword
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  // Form submission handlers
  onSaveProfile(): void {
    if (this.profileForm.valid) {
      this.isProfileSaving = true
      // If the field is disabled, its value won't be included in .value
      // We need to use .getRawValue() to include the disabled email 
      // (though backend ignores it for social users, it's good practice to send complete data)
      const formData = this.profileForm.getRawValue();
      this.authService.updateAccountSettings(formData).subscribe({
        next: (response) => {
          console.log("Profile updated:", response)
          this.user = this.profileForm.value;
          this.profileForm.markAsPristine();
          this.isProfileSaving = false
          this.authService.toastr.success('Profile updated successfully!')
        },
        error: (err) => {
          console.error("Error updating profile:", err)
          this.isProfileSaving = false
          this.authService.toastr.error('Failed to update profile. Please try again.')
        }
      })
    } else {
      this.markFormGroupTouched(this.profileForm)
    }
  }

  onCancelProfile(): void {
    this.profileForm.patchValue({
      firstName: this.user.firstname || '',
      lastName: this.user.lastname || '',
      email: this.user.email || '',
      phoneNumber: this.user.phone || ''
    });
    this.profileForm.markAsPristine();
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.isPasswordSaving = true

      // Simulate API call
      setTimeout(() => {
        console.log("Password changed")
        this.isPasswordSaving = false
        this.passwordForm.reset()
        // Add success notification here
      }, 2000)
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
}

