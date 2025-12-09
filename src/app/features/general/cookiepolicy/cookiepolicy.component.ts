import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/sections/navbar/navbar.component';
import { FooterComponent } from '../../../shared/sections/footer/footer.component';


@Component({
  selector: 'app-cookiepolicy',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './cookiepolicy.component.html',
  styleUrl: './cookiepolicy.component.css'
})
export class CookiepolicyComponent {

}
