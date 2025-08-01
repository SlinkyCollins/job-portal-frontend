import { CommonModule } from "@angular/common"
import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule, type AbstractControl } from "@angular/forms"

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
  showCurrentPassword = false
  showOldPassword = false
  showNewPassword = false
  showConfirmPassword = false

  // Loading states
  isProfileSaving = false
  isPasswordSaving = false

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForms()
  }

  private initializeForms(): void {
    // Profile form
    this.profileForm = this.fb.group({
      firstName: ["John Doe", [Validators.required, Validators.minLength(2)]],
      lastName: ["Kabir", [Validators.required, Validators.minLength(2)]],
      email: ["johndoe@example.com", [Validators.required, Validators.email]],
      phoneNumber: ["+910 321 889 021", [Validators.required]],
      currentPassword: ["", [Validators.required]],
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

  // Password visibility toggles
  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword
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

      // Simulate API call
      setTimeout(() => {
        console.log("Profile updated:", this.profileForm.value)
        this.isProfileSaving = false
        // Add success notification here
      }, 2000)
    } else {
      this.markFormGroupTouched(this.profileForm)
    }
  }

  onCancelProfile(): void {
    this.profileForm.reset()
    this.initializeForms() // Reset to initial values
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

