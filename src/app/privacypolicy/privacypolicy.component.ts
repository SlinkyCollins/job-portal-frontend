import { Component } from '@angular/core';
import { NavbarComponent } from '../components/sections/navbar/navbar.component';
import { FooterComponent } from '../components/sections/footer/footer.component';

@Component({
  selector: 'app-privacypolicy',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.css'
})
export class PrivacypolicyComponent {

}
