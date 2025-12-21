import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
selector: 'app-admin-dashboard',
imports: [
    RouterOutlet,
    RouterLink
],
templateUrl: './admin-dashboard.component.html',
styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
constructor(private authService: AuthService) { }

logout() {
    this.authService.logout();
}
}
