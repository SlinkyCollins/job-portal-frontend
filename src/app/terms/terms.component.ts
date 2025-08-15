import { Component } from '@angular/core';
import { NavbarComponent } from '../components/sections/navbar/navbar.component';
import { FooterComponent } from '../components/sections/footer/footer.component';

@Component({
  selector: 'app-terms',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {

}
