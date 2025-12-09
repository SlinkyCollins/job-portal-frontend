import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/sections/navbar/navbar.component';
import { FooterComponent } from '../../../shared/sections/footer/footer.component';

@Component({
  selector: 'app-privacypolicy',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.css'
})
export class PrivacypolicyComponent {

}
