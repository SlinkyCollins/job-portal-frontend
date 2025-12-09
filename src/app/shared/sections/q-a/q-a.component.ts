import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-q-a',
  imports: [RouterLink, CommonModule],
  templateUrl: './q-a.component.html',
  styleUrl: './q-a.component.css'
})
export class QAComponent {
  constructor(private authService: AuthService) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
