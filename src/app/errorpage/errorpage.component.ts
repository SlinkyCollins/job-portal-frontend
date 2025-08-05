import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit {

  errorCode: string = '404';
  errorTitle: string = 'Page Not Found';
  errorMessage: string = 'Can not find what you need? Take a moment and do a search below or start from our Homepage.';
  
  // Animation states
  isAnimated: boolean = false;
  
  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Trigger animation after component loads
    setTimeout(() => {
      this.isAnimated = true;
    }, 100);
  }

  goBack(): void {
    // Try to go back in browser history first
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // If no history, navigate to home
      this.router.navigate(['/']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  // Method to handle search functionality if needed
  onSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      // Implement search logic here
      console.log('Searching for:', searchTerm);
      // Example: this.router.navigate(['/search'], { queryParams: { q: searchTerm } });
    }
  }

  // Method to get current year for footer if needed
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Method to handle button hover effects
  onButtonHover(isHovering: boolean): void {
    // Can be used for additional hover effects if needed
  }
}