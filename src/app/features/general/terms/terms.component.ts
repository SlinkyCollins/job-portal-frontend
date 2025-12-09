import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/sections/navbar/navbar.component';
import { FooterComponent } from '../../../shared/sections/footer/footer.component';


@Component({
  selector: 'app-terms',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {

}
