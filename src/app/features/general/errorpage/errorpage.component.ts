import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.css']
})
export class ErrorpageComponent implements OnInit {

  errorCode = '404';
  errorTitle = 'Page Not Found';
  errorMessage = "Can't find what you need? You can go back or head to the homepage.";
  isAnimated = false;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.isAnimated = true, 100);
  }

  goBack(): void {
    window.history.length > 1 ? this.location.back() : this.router.navigate(['/']);
  }
}
