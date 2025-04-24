import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-job-card',
    imports: [CommonModule],
    templateUrl: './job-card.component.html',
    styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  @Input() job: any;

  
}
