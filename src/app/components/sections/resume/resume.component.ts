// resume.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {
  resumeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
