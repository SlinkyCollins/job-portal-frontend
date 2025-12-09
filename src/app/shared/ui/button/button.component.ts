// button.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button [ngClass]="variant" [disabled]="disabled">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      cursor: pointer;
    }

    .primary {
      background-color: #007bff;
      color: white;
    }

    .secondary {
      background-color: #6c757d;
      color: white;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
  standalone: true
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
}
