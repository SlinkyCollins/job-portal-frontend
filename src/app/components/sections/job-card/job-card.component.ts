import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-job-card',
    imports: [CommonModule],
    templateUrl: './job-card.component.html',
    styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  public jobs = [
    {
      title: 'Developer & expert in java c++',
      type: 'Fulltime',
      date: '18 Jul 2024',
      company: 'Slack',
      location: 'Spain, Barcelona',
      tags: 'Developer,Coder',
      logo: '/assets/img-2.png'
    },

    {
      title: 'Animator & expert in maya 3D',
      type: 'Part time',
      date: '25 Jul 2024',
      company: 'Google',
      location: 'USA,New York',
      tags: 'Finance, Accounting',
      logo: '/assets/img-6.png'
    },

    {
      title: 'Marketing Specialist in SEO & SMM',
      type: 'Part time',
      date: '25 Jan 2024',
      company: 'Pinterest',
      location: 'USA, Alaska',
      tags: 'Design,Artist',
      logo: '/assets/img-3.png'
    },

    {
      title: 'Developer & expert in javascript c++',
      type: 'Fulltime',
      date: '10 Feb 2024',
      company: 'Instagram',
      location: 'USA, California',
      tags: 'Application,Marketing',
      logo: '/assets/img-4.png'
    },

    {
      title: 'Lead & Product Designer',
      type: 'Fulltime',
      date: '15 Feb 2024',
      company: 'LinkedIn',
      location: 'UK, London',
      tags: 'Finance,Business',
      logo: '/assets/img-5.png'
    },
  ];
}
