// resume.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume',
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  resumeForm!: FormGroup;
  selectedFileName: string = 'No file chosen';
  uploadProgress: number = 0;
  isUploading: boolean = false;
  isDeleting: boolean = false;
  uploadedCV: string = '';
  showDeleteModal: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      title: ['', Validators.required],
      category: [''],
      overview: [''],
      photo: [''],
      education: this.fb.array([this.createEducation()]),
      skills: this.fb.array([]),
      newSkill: [''],
      portfolio: this.fb.array([])
    });
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getSeekerProfile().subscribe({
      next: (response: any) => {
        if (response.status) {
          this.uploadedCV = response.profile.cv_url || '';
          this.selectedFileName = response.profile.cv_filename || 'No file chosen';
        }
      },
      error: (err) => console.error('Failed to load profile:', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.authService.toastr.error('Please select a valid CV file (PDF, DOC, or DOCX).');
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
    this.authService.uploadCV(file, filename).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          const res = event.body;
          if (res.status) {
            this.authService.toastr.success('CV uploaded successfully ✅');
            this.uploadedCV = res.url || '';
            this.loadProfile();  // Refresh
          } else {
            this.authService.toastr.error(res.message);
          }
          this.isUploading = false;
        }
      },
      error: (err) => {
        this.authService.toastr.error('CV upload failed. Please try again.');
        this.isUploading = false;
      }
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
    this.authService.deleteCV().subscribe({
      next: () => {
        this.closeDeleteModal();
        this.authService.toastr.success('CV deleted successfully!');
        this.loadProfile();
      },
      error: (err) => {
        this.authService.toastr.error('Failed to delete CV.');
        this.closeDeleteModal();
        this.isDeleting = false;
      }
    });
  }

  createEducation(): FormGroup {
    return this.fb.group({
      school: [''],
      field: [''],
      startYear: [''],
      endYear: [''],
      description: ['']
    });
  }

  get education(): FormArray {
    return this.resumeForm.get('education') as FormArray;
  }

  addEducation(): void {
    this.education.push(this.createEducation());
  }

  get skills(): FormArray {
    return this.resumeForm.get('skills') as FormArray;
  }

  addSkill(): void {
    const newSkill = this.resumeForm.get('newSkill')?.value;
    if (newSkill) {
      this.skills.push(this.fb.control(newSkill));
      this.resumeForm.get('newSkill')?.reset();
    }
  }

  onSubmit(): void {
    if (this.resumeForm.valid) {
      console.log(this.resumeForm.value);
    }
  }
}
