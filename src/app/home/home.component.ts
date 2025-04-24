import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobCardComponent } from "../components/job-card/job-card.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faSolidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';


@Component({
    selector: 'app-home',
    imports: [RouterLink, CommonModule, JobCardComponent, FontAwesomeModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
  faStarFull = faSolidStar;
  faStarHalf = faStarHalfAlt;
  faStarEmpty = faRegularStar;

  
  ngOnInit(){

  };

  public isMenuOpen = false;

  public selectedFileName: string = 'No file chosen';

  public categories = [
    { icon: 'edit', header: 'UI/UX Design', text: '12k+ Jobs' },
    { icon: 'code', header: 'Development', text: '7k+ Jobs' },
    { icon: 'phone', header: 'Telemarketing', text: '210k+ Jobs' },
    { icon: 'bag', header: 'Marketing', text: '420k+ Jobs' },
    { icon: 'filter', header: 'Editing', text: '3k+ Jobs' },
    { icon: 'bank', header: 'Accounting', text: '150k+ Jobs' },
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

  public testimonials = [
    {
      logo: "/assets/monday-logo.png",
      quote: "Seattle Opera simplifies performance planning with JobNet eSignature.",
      name: "James Brower",
      role: "Lead Designer",
      rating: 4.8,
      review: "Excellent"
    },
    {
      logo: "/assets/shipbob-logo.png",
      quote: "JobNet made our workflow 10x faster. Unreal experience.",
      name: "Anita Gomez",
      role: "Product Manager",
      rating: 5.0,
      review: "Excellent"
    },
    {
      logo: "/assets/monday-logo.png",
      quote: "We closed deals faster thanks to JobNet's easy integration.",
      name: "Kevin Tran",
      role: "Chief Technology Officer",
      rating: 4.7,
      review: "Excellent"
    },
    {
      logo: "/assets/shipbob-logo.png",
      quote: "The UI is slick, intuitive, and just works. Huge fan of JobNet.",
      name: "Sarah Johnson",
      role: "Marketing Director",
      rating: 4.9,
      review: "Excellent"
    },
    {
      logo: "/assets/monday-logo.png",
      quote: "We’ve tried other platforms but none matched the speed and flexibility of JobNet.",
      name: "Brian Lee",
      role: "Senior Developer",
      rating: 4.6,
      review: "Great"
    },
    {
      logo: "/assets/monday-logo.png",
      quote: "We now close contracts in minutes, not days. Impressive stuff.",
      name: "Liam Walker",
      role: "Legal Advisor",
      rating: 4.8,
      review: "Excellent"
    },
    {
      logo: "/assets/shipbob-logo.png",
      quote: "JobNet streamlined our onboarding process and helped us cut paperwork by 70%.",
      name: "Tunde Alabi",
      role: "Human Resources Lead",
      rating: 4.4,
      review: "Nice"
    },
    {
      logo: "/assets/monday-logo.png",
      quote: "The user experience is just top-notch. Even non-tech staff love it.",
      name: "Chukwuma Nnaji",
      role: "IT Support Manager",
      rating: 4.7,
      review: "Excellent"
    },
    {
      logo: "/assets/shipbob-logo.png",
      quote: "Very intuitive platform. It just works. Kudos to the dev team!",
      name: "Segun Ojo",
      role: "Quality Assurance Analyst",
      rating: 4.3,
      review: "Good"
    },
    {
      logo: "/assets/monday-logo.png",
      quote: "Our document approval flow was a pain. JobNet made it painless.",
      name: "Fatima Bello",
      role: "Operations Coordinator",
      rating: 4.6,
      review: "Great"
    },
    {
      logo: "/assets/monday-logo.png",
      quote: "Security was our biggest concern. JobNet passed all our audits.",
      name: "Ifeanyi Eze",
      role: "InfoSec Analyst",
      rating: 4.7,
      review: "Excellent"
    }    
  ];
  

  public faqs = [
    {
      question: "How to create an account?",
      answer: "To create an account, click on the 'Sign Up' button and fill in the required details."
    },
    {
      question: "How to reset my password?",
      answer: "To reset your password, click on 'Forgot Password' and follow the instructions."
    },
    {
      question: "How to apply for a job?",
      answer: "To apply for a job, click on the job listing and follow the application process."
    },
  ];

  getStars(rating: number): ('full' | 'half' | 'empty')[] {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars: ('full' | 'half' | 'empty')[] = [];
  
    for (let i = 0; i < full; i++) {
      stars.push('full');
    }
  
    if (hasHalf) {
      stars.push('half');
    }
  
    while (stars.length < 5) {
      stars.push('empty');
    }
  
    return stars;
  }
  

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