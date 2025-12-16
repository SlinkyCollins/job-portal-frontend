import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
    private router: Router
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
      benefits: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
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

  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;

    // CLONE the form value so we don't mess up the UI
    const formData = { ...this.jobForm.value };

    // CLEAN the salary (Remove commas: "250,000" -> 250000)
    if (formData.salary_amount) {
      formData.salary_amount = parseInt(formData.salary_amount.toString().replace(/,/g, ''), 10);
    }

    this.dashboardService.postJob(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status) {
          this.toastr.success('Job posted successfully!');
          this.router.navigate(['/dashboard/employer/my-jobs']);
        } else {
          this.toastr.error(res.message || 'Failed to post job.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('An error occurred. Please try again.');
        console.error(err);
      }
    });
  }
}