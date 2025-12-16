import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit {
  jobForm: FormGroup;
  isLoading = false;
  categories: any[] = [];

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
      deadline: [''], // Optional but recommended

      // Rich Text / Long Text Fields
      overview: ['', [Validators.required, Validators.minLength(50)]],
      description: ['', [Validators.required, Validators.minLength(100)]],
      responsibilities: ['', Validators.required],
      requirements: ['', Validators.required],
      nice_to_have: [''],
      benefits: [''],
      // Add Status field (Only relevant for Edit, but harmless to have in form group)
      status: ['active']
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;

      // 2. ONLY AFTER categories are here, check if we need to edit a job
      this.checkEditMode();
    });
  }

  checkEditMode() {
    // Check for ID in URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJobDetails(this.jobId); // Now it's safe to load details!
    }
  }

  // 1. The Formatting Logic
  formatSalary(event: any) {
    const input = event.target;
    let value = input.value;

    // Remove all non-numeric characters (except dot if you want decimals, but usually integers are fine for salary)
    value = value.replace(/[^0-9]/g, '');

    if (value) {
      // Format with commas (e.g. 1000 -> 1,000)
      value = new Intl.NumberFormat('en-US').format(parseInt(value));
    }

    // Update the input value visually
    input.value = value;

    // Update the form control value (keep the commas for now so the user sees them)
    this.jobForm.get('salary_amount')?.setValue(value, { emitEvent: false });
  }

  // ✨ CUSTOM VALIDATOR HELPER
  salaryRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let 'Validators.required' handle empty values
      }

      // 1. Remove commas to get the raw number
      const rawValue = control.value.toString().replace(/,/g, '');
      const numValue = Number(rawValue);

      // 2. Check if it's a valid number
      if (isNaN(numValue)) {
        return { invalidNumber: true };
      }

      // 3. Check Range
      if (numValue < min) {
        return { min: { min, actual: numValue } };
      }
      if (numValue > max) {
        return { max: { max, actual: numValue } };
      }

      return null; // Valid!
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
    // 1. Format Salary (Add commas for display)
    let formattedSalary = data.salary_amount;
    if (formattedSalary) {
      formattedSalary = new Intl.NumberFormat('en-US').format(parseInt(formattedSalary));
    }

    // 2. Patch the form
    this.jobForm.patchValue({
      title: data.title,
      category_id: data.category_id, // Ensure this matches the type in <option [ngValue]>
      employment_type: data.employment_type,
      location: data.location,
      salary_amount: formattedSalary, // Show formatted string
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
  }

  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = { ...this.jobForm.value };

    // Clean Salary (Remove commas)
    if (formData.salary_amount) {
      formData.salary_amount = parseInt(formData.salary_amount.toString().replace(/,/g, ''), 10);
    }

    if (this.isEditMode && this.jobId) {
      // --- UPDATE MODE ---
      formData.job_id = this.jobId; // Add ID to payload

      this.dashboardService.updateJob(formData).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.status) {
            this.toastr.success('Job updated successfully!');
            this.router.navigate(['/dashboard/employer/my-jobs']);
          } else {
            this.toastr.error(res.message || 'Update failed');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('An error occurred');
        }
      });

    } else {
      // --- CREATE MODE ---
      this.dashboardService.postJob(formData).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.status) {
            this.toastr.success('Job posted successfully!');
            this.router.navigate(['/dashboard/employer/my-jobs']);
          } else {
            this.toastr.error(res.message || 'Post failed');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error('An error occurred');
        }
      });
    }
  }
}