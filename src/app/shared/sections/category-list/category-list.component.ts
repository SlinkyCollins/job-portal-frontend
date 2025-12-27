import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
   public categories = [
    { icon: 'edit', header: 'UI/UX Design', text: '12k+ Jobs' },
    { icon: 'code', header: 'Development', text: '7k+ Jobs' },
    { icon: 'phone', header: 'Telemarketing', text: '210k+ Jobs' },
    { icon: 'bag', header: 'Marketing', text: '420k+ Jobs' },
    { icon: 'filter', header: 'Editing', text: '3k+ Jobs' },
    { icon: 'bank', header: 'Accounting', text: '150k+ Jobs' },
  ];
}
