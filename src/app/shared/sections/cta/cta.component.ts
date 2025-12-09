import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cta',
  imports: [RouterLink, CommonModule],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css'
})
export class CtaComponent {
 constructor (private authService: AuthService) {}

 isLoggedIn(): boolean {
  return this.authService.isLoggedIn();
 }
}
