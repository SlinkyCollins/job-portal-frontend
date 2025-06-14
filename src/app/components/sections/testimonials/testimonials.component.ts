import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faStar as faSolidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  faStarFull = faSolidStar;
  faStarHalf = faStarHalfAlt;
  faStarEmpty = faRegularStar;

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
  };

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
}
