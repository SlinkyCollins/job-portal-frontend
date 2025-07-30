import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrolltopbtnComponent } from './components/ui/scrolltopbtn/scrolltopbtn.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ScrolltopbtnComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JobPortal';
}
