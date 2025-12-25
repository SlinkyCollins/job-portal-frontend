import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../../core/services/category.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostJobComponent implements OnInit {
  jobForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  showCancelConfirm = false;
  categories: any[] = [];

  // Custom Tag Input
  tags: string[] = [];
  allAvailableTags: any[] = [];  // All tags fetched from DB
  filteredTags: any[] = [];      // Tags to display in the suggestions area
  showAllTags = false;
  maxTags = 5;

  isEditMode = false;
  jobId: number | null = null;

  // Enums for dropdowns (matching your DB)
  employmentTypes = ['fulltime', 'parttime', 'contract', 'internship', 'fixedprice', 'freelance', 'remote'];
  experienceLevels = ['Fresher', 'Junior', 'Mid', 'Senior', 'No-Experience', 'Internship', 'Expert'];
  englishLevels = ['Basic', 'Intermediate', 'Fluent', 'Native'];
  currencies = ['NGN', 'USD', 'GBP', 'EUR'];
  salaryDurations = ['Hourly', 'Monthly', 'Weekly'];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category_id: [null, Validators.required],
      employment_type: ['fulltime', Validators.required],
      location: ['', Validators.required],
      tags: [[]],

      // Salary Section
      salary_amount: [null, [
        Validators.required,
        this.salaryRangeValidator(1, 99999999)
      ]],
      currency: ['NGN', Validators.required],
      salary_duration: ['Monthly', Validators.required],

      // Details
      experience_level: ['Mid', Validators.required],
      english_fluency: ['Fluent'],
      deadline: [''],

      // Rich Text / Long Text Fields
      overview: ['', [Validators.required, Validators.minLength(50)]],
      description: ['', [Validators.required, Validators.minLength(100)]],
      responsibilities: ['', Validators.required],
      requirements: ['', Validators.required],
      nice_to_have: [''],
      benefits: [''],
      status: ['active']
    });
  }

  ngOnInit(): void {
    this.loadTags();

    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.checkEditMode();
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJobDetails(this.jobId);
    }
  }

  // --- TAGS LOGIC START ---

  // 1. Load All Tags from Backend
  loadTags() {
    this.dashboardService.getTags().subscribe({
      next: (res) => {
        if (res.status) {
          this.allAvailableTags = res.data;
          this.filterSuggestions(); 
        }
      }
    });
  }

  // 2. Add Tag via "Enter" Key
  addTag(event: any) {
    const input = event.target;
    const value = input.value.trim();

    if (this.tags.length >= this.maxTags) {
      this.toastr.warning(`You can only add up to ${this.maxTags} tags.`);
      input.value = '';
      return;
    }

    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      this.jobForm.get('tags')?.setValue(this.tags);
      this.filterSuggestions();
      this.jobForm.markAsDirty();
    }
    input.value = '';
  }

  // 3. Add Tag via Clicking a Suggestion
  selectSuggestion(tagName: string) {
    if (this.tags.length >= this.maxTags) {
      this.toastr.warning(`You can only add up to ${this.maxTags} tags.`);
      return;
    }

    if (!this.tags.includes(tagName)) {
      this.tags.push(tagName);
      this.jobForm.get('tags')?.setValue(this.tags);
      this.filterSuggestions();
      this.jobForm.markAsDirty();
    }
  }

  // 4. Remove Tag
  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.jobForm.get('tags')?.setValue(this.tags);
    this.filterSuggestions();
    this.jobForm.markAsDirty();
  }

  // 5. Filter Suggestions (Hide already selected ones)
  filterSuggestions(searchText: string = '') {
    this.filteredTags = this.allAvailableTags.filter(tag => {
      const isNotSelected = !this.tags.includes(tag.name);
      const matchesSearch = tag.name.toLowerCase().includes(searchText.toLowerCase());
      return isNotSelected && matchesSearch;
    });
  }

  // 6. Handle Typing in Input to Filter Real-time
  onTagInput(event: any) {
    this.filterSuggestions(event.target.value);
  }

  // --- TAGS LOGIC END ---

  formatSalary(event: any) {
    const input = event.target;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    if (value) {
      value = new Intl.NumberFormat('en-US').format(parseInt(value));
    }
    input.value = value;
    this.jobForm.get('salary_amount')?.setValue(value, { emitEvent: false });
  }

  salaryRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const rawValue = control.value.toString().replace(/,/g, '');
      const numValue = Number(rawValue);
      if (isNaN(numValue)) return { invalidNumber: true };
      if (numValue < min) return { min: { min, actual: numValue } };
      if (numValue > max) return { max: { max, actual: numValue } };
      return null;
    };
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 == c2;
  }

  loadJobDetails(id: number) {
    this.isLoading = true;
    this.dashboardService.getJobDetails(id).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status) {
          this.patchFormValues(res.data);
        } else {
          this.toastr.error('Job not found');
          this.router.navigate(['/dashboard/employer/my-jobs']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Error loading job details');
        this.router.navigate(['/dashboard/employer/my-jobs']);
      }
    });
  }

  patchFormValues(data: any) {
    let formattedSalary = data.salary_amount;
    if (formattedSalary) {
      formattedSalary = new Intl.NumberFormat('en-US').format(parseInt(formattedSalary));
    }

    this.jobForm.patchValue({
      title: data.title,
      category_id: data.category_id,
      employment_type: data.employment_type,
      location: data.location,
      salary_amount: formattedSalary,
      currency: data.currency,
      salary_duration: data.salary_duration,
      experience_level: data.experience_level,
      english_fluency: data.english_fluency,
      deadline: data.deadline,
      overview: data.overview,
      description: data.description,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      nice_to_have: data.nice_to_have,
      benefits: data.benefits,
      status: data.status
    });

    if (data.tags) {
      if (Array.isArray(data.tags)) {
        this.tags = data.tags.map((t: any) => typeof t === 'object' ? t.name : t);
        this.jobForm.get('tags')?.setValue(this.tags);
        this.filterSuggestions(); // Update suggestions based on loaded tags
      }
    }
  }

  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }

    this.isSubmitting = true;
    const formData = { ...this.jobForm.value };

    if (formData.salary_amount) {
      formData.salary_amount = parseInt(formData.salary_amount.toString().replace(/,/g, ''), 10);
    }

    if (this.isEditMode && this.jobId) {
      formData.job_id = this.jobId;
      this.dashboardService.updateJob(formData).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res.status) {
            this.toastr.success('Job updated successfully!');
            this.router.navigate(['/dashboard/employer/my-jobs']);
          } else {
            this.toastr.error(res.message || 'Update failed');
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error('An error occurred');
        }
      });
    } else {
      this.dashboardService.postJob(formData).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res.status) {
            this.toastr.success('Job posted successfully!');
            this.router.navigate(['/dashboard/employer/my-jobs']);
          } else {
            this.toastr.error(res.message || 'Post failed');
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error('An error occurred');
        }
      });
    }
  }

  onReset(): void {
    if (this.jobForm.dirty) {
      this.showCancelConfirm = true;
    } else {
      this.router.navigate(['/dashboard/employer/my-jobs']);
    }
  }

  // New: Hide the modal
  hideCancelModal(): void {
    this.showCancelConfirm = false;
  }

  // New: Confirm cancel and navigate
  confirmCancel(): void {
    this.showCancelConfirm = false;
    this.router.navigate(['/dashboard/employer/my-jobs']);
  }
}