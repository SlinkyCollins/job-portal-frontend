import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobCardComponent } from "../components/job-card/job-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, JobCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public isMenuOpen = false;

  public selectedFileName: string = 'No file chosen';

  public categories = [
    { icon: 'edit', header: 'UI/UX Design', text: '12k+ Jobs' },
    { icon:'code', header: 'Development', text: '7k+ Jobs' },
    { icon:'phone', header: 'Telemarketing', text: '210k+ Jobs' },
    { icon:'bag', header: 'Marketing', text: '420k+ Jobs' },
    { icon:'filter', header: 'Editing', text: '3k+ Jobs' },
    { icon:'bank', header: 'Accounting', text: '150k+ Jobs' },
  ];  

  public jobs = [
    {
      title: 'Developer & expert in Java, C++',
      type: 'Fulltime',
      date: '18 Jul 2024',
      company: 'Slack',
      location: 'Spain, Barcelona',
      tags: 'Developer, Coder',
      logo: '/assets/img-2.png'
    },

    {
      title: 'Animator & expert in maya 3D',
      type: 'Part time',
      date: '25 Jul 2024',
      company: 'Google',
      location: 'USA, New York',
      tags: 'Finance, Accounting',
      logo: '/assets/img-6.png'
    },

    {
      title: 'Marketing Specialist in SEO & SMM',
      type: 'Part time',
      date: '25 Jan 2024',
      company: 'Pinterest',
      location: 'USA, Alaska',
      tags: 'Design, Artist',
      logo: '/assets/img-3.png'
    },

    {
      title: 'Developer & expert in Javascript, C+',
      type: 'Fulltime',
      date: '10 Feb 2024',
      company: 'Instagram',
      location: 'USA, California',
      tags: 'Application, Marketing',
      logo: '/assets/img-4.png'
    },

    {
      title: 'Lead & Product Designer',
      type: 'Fulltime',
      date: '15 Feb 2024',
      company: 'LinkedIn',
      location: 'UK, London',
      tags: 'Finance, Business',
      logo: '/assets/img-5.png'
    },
  ];
  

  isSelectOpen1 = false;
  isSelectOpen2 = false;

toggleSelectOpen1() {
  this.isSelectOpen1 = !this.isSelectOpen1;
}

toggleSelectOpen2() {
  this.isSelectOpen2 = !this.isSelectOpen2;
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFileName = file.name;
    document.getElementById("fileName")!.textContent = file.name;
  } else {
    this.selectedFileName = 'No file chosen';
    document.getElementById("fileName")!.textContent = 'No file chosen';
  }
}


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

}





