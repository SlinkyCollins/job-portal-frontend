import { Component } from "@angular/core"
import { NavbarComponent } from "../components/sections/navbar/navbar.component"
import { FooterComponent } from "../components/sections/footer/footer.component"
import { CommonModule } from "@angular/common"
import { CtaComponent } from "../components/sections/cta/cta.component"

interface JobDetails {
  title: string
  company: string
  location: string
  salary?: string
  tags: string[]
  overview: string
  description: string
  responsibilities: string[]
  requiredSkills: string[]
  benefits: string[]
}

interface RelatedJob {
  title: string
  company: string
  location: string
  type: string
}

@Component({
  selector: "app-job-details",
  imports: [NavbarComponent, FooterComponent, CommonModule, CtaComponent],
  standalone: true,
  templateUrl: "./job-details.component.html",
  styleUrls: ["./job-details.component.css"],
})
export class JobDetailsComponent {
  job: JobDetails = {
    title: "Senior Product & Brand Design",
    company: "TechCorp Inc.",
    location: "Remote",
    salary: "$80,000 - $120,000",
    tags: ["Full-time", "Remote", "Design", "Senior Level"],
    overview:
      "We are looking for a talented and experienced Senior Product & Brand Designer to join our dynamic team. This role combines strategic thinking with hands-on design execution, requiring someone who can think both big picture and dive into the details when needed.",
    description:
      "As a Product Designer at TechCorp Inc., you'll have the opportunity to shape the future of our product offerings. You'll work closely with cross-functional teams to create user-centered designs that drive business results and deliver exceptional user experiences.",
    responsibilities: [
      "Lead end-to-end design process from concept to final implementation, including user research, wireframing, prototyping, and visual design",
      "Collaborate closely with product managers, engineers, and other stakeholders to define and execute product vision",
      "Conduct user research, usability testing, and data analysis to inform design decisions",
      "Create and maintain design systems, style guides, and design documentation",
      "Mentor junior designers and contribute to the overall design culture of the organization",
      "Stay up-to-date with design trends, tools, and best practices in the industry",
      "Present design concepts and rationale to stakeholders and leadership team",
    ],
    requiredSkills: [
      "5+ years of experience in product design or related field",
      "Proficiency in design tools such as Figma, Sketch, Adobe Creative Suite",
      "Strong portfolio demonstrating user-centered design process and outcomes",
      "Experience with user research methodologies and usability testing",
      "Knowledge of front-end development principles and constraints",
      "Excellent communication and presentation skills",
      "Bachelor's degree in Design, HCI, or related field preferred",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work arrangements and remote-first culture",
      "Professional development budget and learning opportunities",
      "Generous PTO and sabbatical programs",
    ],
  }

  relatedJobs: RelatedJob[] = [
    {
      title: "Application Security Engineer",
      company: "SecureTech",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Data Science Expert With Algorithms",
      company: "DataCorp",
      location: "San Francisco",
      type: "Full-time",
    },
    {
      title: "Software Engineer",
      company: "InnovateLab",
      location: "New York",
      type: "Full-time",
    },
  ]

  onApplyNow(): void {
    // Handle apply now action
    console.log("Apply now clicked")
  }

  onSaveJob(): void {
    // Handle save job action
    console.log("Save job clicked")
  }
}
