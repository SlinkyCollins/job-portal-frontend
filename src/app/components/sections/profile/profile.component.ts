// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any = {
    // profileImage: 'https://mockmind-api.uifaces.co/content/human/80.jpg',
    name: 'John Doe',
    email: 'company@gmail.com',
    website: 'http://companysite.com',
    foundedDate: '2015-09-01',
    size: '200',
    phone: '+2347020000000',
    category: 'Finance, Marketing',
    about: 'We are passionate about delivering tech-driven hiring solutions.',
    socialLinks: {
      facebook: 'https://facebook.com/',
      twitter: 'https://twitter.com/'
    },
    address: {
      street: 'Domecare, Oshimili, Chagari Sadar',
      country: 'Nigeria',
      city: 'Lagos',
      zip: '1020',
      state: 'Lagos',
      map: '6.5244° N, 3.3792° E'
    },
    members: ['John Smith']
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.user.name],
      email: [this.user.email],
      website: [this.user.website],
      foundedDate: [this.user.foundedDate],
      size: [this.user.size],
      phone: [this.user.phone],
      category: [this.user.category],
      about: [this.user.about],
      facebook: [this.user.socialLinks.facebook],
      twitter: [this.user.socialLinks.twitter],
      street: [this.user.address.street],
      country: [this.user.address.country],
      city: [this.user.address.city],
      zip: [this.user.address.zip],
      state: [this.user.address.state],
      map: [this.user.address.map],
      member: [this.user.members[0] || '']
    });
  }

  onSubmit() {
    console.log('Form submitted:', this.profileForm.value);
  }

  onReset() {
    this.profileForm.reset(this.user); // Reset to original user data
  }
}
