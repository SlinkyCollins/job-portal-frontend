import { Pipe, PipeTransform } from '@angular/core';
// Import the environment file to check if we are in prod or local mode
// import { environment } from '../../../environments/environment';
import { environment } from '../../../environments/environment.prod';


@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    let date: Date;

    // CHECK ENVIRONMENT HERE
    if (environment.production) {
      // --- PRODUCTION (Render/UTC) ---
      // Parse manually as UTC
      const parts = value.split(/[- :]/).map(Number);
      date = new Date(Date.UTC(
        parts[0],      // Year
        parts[1] - 1,  // Month
        parts[2],      // Day
        parts[3] || 0, // Hour
        parts[4] || 0, // Minute
        parts[5] || 0  // Second
      ));
    } else {
      // --- LOCAL (XAMPP/Local Time) ---
      // Let the browser parse it as local time
      // (This works because your local DB and local Browser are in the same timezone)
      date = new Date(value);
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Handle future dates (or slight clock skew)
    if (diffMs < 0) return 'Just now';

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;

    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }
}