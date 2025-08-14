import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  contactInfo = {
    address: {
      title: 'Our Address',
      details: 'Bass Hill Plaza Medical Centre',
      location: 'Sydney, Australia',
      icon: 'fas fa-map-marker-alt'
    },
    contact: {
      title: 'Contact Info',
      details: 'Open 6 days a week call us',
      phone: '310.841.5500',
      icon: 'fas fa-envelope'
    },
    support: {
      title: 'Live Support',
      details: 'live chat service',
      website: 'www.politechat.com',
      icon: 'fas fa-comments'
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.submitError = false;
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.resetForm();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      }, 2000);
    }
  }

  public isFormValid(): boolean {
    return !!(
      this.contactForm.name.trim() &&
      this.contactForm.email.trim() &&
      this.contactForm.subject.trim() &&
      this.contactForm.message.trim() &&
      this.isValidEmail(this.contactForm.email)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  getFormValidationClass(fieldName: keyof ContactForm): string {
    const field = this.contactForm[fieldName];
    if (!field.trim()) return '';
    
    if (fieldName === 'email') {
      return this.isValidEmail(field) ? 'is-valid' : 'is-invalid';
    }
    
    return field.trim().length > 0 ? 'is-valid' : 'is-invalid';
  }
}