import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';

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
  apiUrl = environment.apiUrl + '/dashboard/employer';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/get_profile.php`).subscribe({
      next: (res) => {
        if (res.status) {
          this.profileForm.patchValue(res.data);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load profile');
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    this.http.post<any>(`${this.apiUrl}/update_profile.php`, this.profileForm.value)
      .subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.status) {
            this.toastr.success('Profile updated successfully');
            this.profileForm.markAsPristine(); // Disable save button until next change
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

  // Helper for the avatar circle
  getInitials(): string {
    const f = this.profileForm.get('firstname')?.value || '';
    const l = this.profileForm.get('lastname')?.value || '';
    return (f.charAt(0) + l.charAt(0)).toUpperCase();
  }
}