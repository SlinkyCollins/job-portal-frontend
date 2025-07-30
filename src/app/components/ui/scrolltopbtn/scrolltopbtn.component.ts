import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scrolltopbtn',
  imports: [CommonModule],
  templateUrl: './scrolltopbtn.component.html',
  styleUrl: './scrolltopbtn.component.css',
})
export class ScrolltopbtnComponent {
public showScrollTop = false;

 @HostListener("window:scroll", [])
  onWindowScroll() {
    this.showScrollTop = window.pageYOffset > 300; // Show button after scrolling 300px
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // makes it scroll smoothly
    });
  }
}
