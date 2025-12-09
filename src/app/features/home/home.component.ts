import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { CtaComponent } from '../../shared/sections/cta/cta.component';
import { HeroComponent } from '../../shared/sections/hero/hero.component';
import { CategoryListComponent } from '../../shared/sections/category-list/category-list.component';
import { TestimonialsComponent } from '../../shared/sections/testimonials/testimonials.component';
import { QAComponent } from '../../shared/sections/q-a/q-a.component';
import { FancybannerComponent } from '../../shared/sections/fancybanner/fancybanner.component';
import { FindtalentsComponent } from '../../shared/sections/findtalents/findtalents.component';
import { JobCardComponent } from '../../shared/sections/job-card/job-card.component';
import { NavbarComponent } from '../../shared/sections/navbar/navbar.component';
import { FooterComponent } from '../../shared/sections/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CtaComponent,
    HeroComponent,
    CategoryListComponent,
    TestimonialsComponent,
    QAComponent,
    FancybannerComponent,
    FindtalentsComponent,
    JobCardComponent,
    NavbarComponent,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private authService: AuthService) { }

  goToDashboard(event: Event) {
    this.authService.goToDashboard(event);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserRole(): string | null {
    return this.authService.getUserRole();
  }

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
