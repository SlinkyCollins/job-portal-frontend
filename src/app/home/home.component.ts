import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { CtaComponent } from "../components/sections/cta/cta.component";
import { NavbarComponent } from "../components/sections/navbar/navbar.component";
import { HeroComponent } from "../components/sections/hero/hero.component";
import { CategoryListComponent } from "../components/sections/category-list/category-list.component";
import { TestimonialsComponent } from "../components/sections/testimonials/testimonials.component";
import { QAComponent } from "../components/sections/q-a/q-a.component";
import { FooterComponent } from "../components/sections/footer/footer.component";
import { FancybannerComponent } from "../components/sections/fancybanner/fancybanner.component";
import { FindtalentsComponent } from "../components/sections/findtalents/findtalents.component";
import { JobCardComponent } from "../components/sections/job-card/job-card.component";
import { ButtonComponent } from "../components/ui/button/button.component";

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CtaComponent,
    NavbarComponent,
    HeroComponent,
    CategoryListComponent,
    TestimonialsComponent,
    QAComponent,
    FooterComponent,
    FancybannerComponent,
    FindtalentsComponent,
    JobCardComponent,
    ButtonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ngOnInit() {

  };

  // public faqs = [
  //   {
  //     question: "How to create an account?",
  //     answer: "To create an account, click on the 'Sign Up' button and fill in the required details."
  //   },
  //   {
  //     question: "How to reset my password?",
  //     answer: "To reset your password, click on 'Forgot Password' and follow the instructions."
  //   },
  //   {
  //     question: "How to apply for a job?",
  //     answer: "To apply for a job, click on the job listing and follow the application process."
  //   },
  // ];

}
