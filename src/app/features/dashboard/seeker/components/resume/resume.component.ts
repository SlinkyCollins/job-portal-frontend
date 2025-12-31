import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth.service';
import { ProfileService } from '../../../../../core/services/profile.service';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { DomSanitizer } from '@angular/platform-browser';
// Custom validator for FormArray (requires at least one item)
export function atLeastOneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const array = control as FormArray;
    return array.length > 0 ? null : { atLeastOne: true };
  };
}

@Component({
  selector: 'app-resume',
  imports: [CommonModule, ReactiveFormsModule, NgxExtendedPdfViewerModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit {
  resumeForm!: FormGroup;
  selectedFileName: string = 'No file chosen';
  uploadProgress: number = 0;
  isUploading: boolean = false;
  isDeleting: boolean = false;
  uploadedCV: string = '';
  showDeleteModal: boolean = false;
  isSaving: boolean = false;
  originalData: any = {}; // Store last saved data
  isLoading: boolean = true;
  completionPercentage: number = 0;
  isAlertDismissed: boolean = false;
  showPreviewModal: boolean = false;
  previewUrl: any = null;
  previewFileType: 'pdf' | 'doc' | 'unknown' = 'unknown';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private dashboardService: DashboardService,
    private sanitizer: DomSanitizer
  ) {
    this.resumeForm = this.fb.group({
      overview: ['', [Validators.required, Validators.maxLength(500)]],
      education: this.fb.array([], atLeastOneValidator()),
      skills: this.fb.array([], atLeastOneValidator()),
      experience: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    this.isAlertDismissed = false;
    this.loadProfile();
    this.profileService.completion$.subscribe((percentage) => {
      this.completionPercentage = percentage;
    });
  }

  openCVPreview() {
    if (!this.uploadedCV || this.uploadedCV.trim() === '') {
      this.authService.toastr.warning('No CV uploaded to preview.');
      return;
    }

    const extension = this.uploadedCV.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      this.previewFileType = 'pdf';
      this.previewUrl = this.uploadedCV;
    } else if (['doc', 'docx'].includes(extension || '')) {
      this.previewFileType = 'doc';
      const googleViewer = `https://docs.google.com/gview?url=${this.uploadedCV}&embedded=true`;
      this.previewUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(googleViewer);
    } else {
      this.previewFileType = 'unknown';
      this.previewUrl = null;
    }

    this.showPreviewModal = true;
  }

  closePreview() {
    this.showPreviewModal = false;
    this.previewUrl = null;
  }

  dismissAlert(): void {
    this.isAlertDismissed = true;
  }

  loadProfile() {
    this.dashboardService.getSeekerProfile().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.uploadedCV = response.profile.cv_url || '';
          this.selectedFileName =
            response.profile.cv_filename || 'No file chosen';
          // Store original data
          this.originalData = {
            overview: response.profile.overview || '',
            experience: response.profile.experience || '',
            education: response.profile.education
              ? JSON.parse(response.profile.education)
              : [],
            skills: response.profile.resume_skills
              ? JSON.parse(response.profile.resume_skills)
              : [],
          };
          // Populate form with original data
          this.populateForm(this.originalData);
          this.profileService.updateCompletionScore(response.profile);
          this.isLoading = false; // Set loading to false after data loads
        }
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
        this.isLoading = false; // Set loading to false even if there is an error
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.authService.toastr.error(
          'Please select a valid CV file (PDF, DOC, or DOCX).'
        );
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.authService.toastr.error('File size must be less than 10MB.');
        return;
      }
      this.selectedFileName = file.name;
      this.authService.toastr.info(`"${file.name}" selected ✅`);
      this.uploadFile(file, this.selectedFileName);
    } else {
      this.selectedFileName = 'No file chosen';
    }
  }

  uploadFile(file: File, filename: string) {
    this.isUploading = true;
    this.uploadProgress = 0;
    this.dashboardService.uploadCV(file, filename).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          const res = event.body;
          if (res.status) {
            this.authService.toastr.success('CV uploaded successfully ✅');
            this.uploadedCV = res.url || '';
            this.loadProfile(); // Refresh
          } else {
            this.authService.toastr.error(res.message);
          }
          this.isUploading = false;
        }
      },
      error: (err) => {
        this.authService.toastr.error('CV upload failed. Please try again.');
        this.isUploading = false;
      },
    });
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    this.isDeleting = true;
    this.dashboardService.deleteCV().subscribe({
      next: () => {
        this.closeDeleteModal();
        this.authService.toastr.success('CV deleted successfully!');
        this.loadProfile();
      },
      error: (err) => {
        this.authService.toastr.error('Failed to delete CV.');
        this.closeDeleteModal();
        this.isDeleting = false;
      },
    });
  }

  createEducation(): FormGroup {
    return this.fb.group({
      school: [''],
      field: [''],
      startYear: [''],
      endYear: [''],
      description: [''],
    });
  }

  get education(): FormArray {
    return this.resumeForm.get('education') as FormArray;
  }

  addEducation(): void {
    this.education.push(
      this.fb.group({
        school: [''],
        field: [''],
        startYear: [''],
        endYear: [''],
        description: [''],
      })
    );
    this.education.markAsDirty();
    this.resumeForm.markAsDirty();
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
    this.education.markAsDirty();
    this.resumeForm.markAsDirty();
  }

  get skills(): FormArray {
    return this.resumeForm.get('skills') as FormArray;
  }

  addSkill(): void {
    const newSkill = (
      document.getElementById('newSkill') as HTMLInputElement
    ).value.trim();
    if (newSkill) {
      this.skills.push(this.fb.control(newSkill));
      this.skills.markAsDirty();
      this.resumeForm.markAsDirty();
      (document.getElementById('newSkill') as HTMLInputElement).value = '';
    }
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
    this.skills.markAsDirty();
    this.resumeForm.markAsDirty();
  }

  onSubmit(): void {
    if (this.resumeForm.valid) {
      this.isSaving = true;
      const formData = {
        overview: this.resumeForm.value.overview,
        education: JSON.stringify(this.resumeForm.value.education),
        resume_skills: JSON.stringify(this.resumeForm.value.skills),
        experience: this.resumeForm.value.experience,
      };
      this.dashboardService.updateResume(formData).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.authService.toastr.success('Resume saved successfully!');
            // Update originalData to current saved data
            this.originalData = {
              overview: this.resumeForm.value.overview,
              experience: this.resumeForm.value.experience,
              education: [...this.resumeForm.value.education],
              skills: [...this.resumeForm.value.skills],
            };
            this.resumeForm.markAsPristine(); // Reset dirty state
            // Just reload. It fetches the full combined profile (User + Resume)
            // and updates the score accurately.
            this.loadProfile();
          } else {
            this.authService.toastr.error(response.message || 'Save failed.');
          }
          this.isSaving = false;
        },
        error: (err: any) => {
          console.log(err);
          this.authService.toastr.error('Failed to save resume.');
          this.isSaving = false;
        },
      });
    } else {
      this.resumeForm.markAllAsTouched();
      this.authService.toastr.error('Please fill all required fields.');
    }
  }

  populateForm(data: any) {
    console.log('Populating form with:', data); // Debug log
    this.resumeForm.patchValue({
      overview: data.overview,
      experience: data.experience,
    });
    // Clear and repopulate education
    while (this.education.length) {
      this.education.removeAt(0);
    }
    data.education.forEach((edu: any) => {
      this.education.push(
        this.fb.group({
          school: [edu.school || ''],
          field: [edu.field || ''],
          startYear: [edu.startYear || ''],
          endYear: [edu.endYear || ''],
          description: [edu.description || ''],
        })
      );
    });
    // Clear and repopulate skills
    while (this.skills.length) {
      this.skills.removeAt(0);
    }
    data.skills.forEach((skill: string) => {
      this.skills.push(this.fb.control(skill));
    });
  }

  onReset(): void {
    console.log('Resetting to original data:', this.originalData); // Debug log
    this.populateForm(this.originalData);
  }
}