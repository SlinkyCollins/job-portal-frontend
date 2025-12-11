import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // THE "EXHAUSTED" FIX:
    // 1. Replace space with 'T' to make it ISO-8601 compatible (fixes Safari/iOS bugs)
    // 2. Do NOT add 'Z'. Do NOT use Date.UTC.
    // 3. This forces the browser to treat the DB time as "Local Time".
    // Result: DB (20:19) vs Now (21:37) = ~78 mins.
    const dateStr = value.replace(' ', 'T'); 
    const date = new Date(dateStr);

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // If the math is slightly negative (clock skew), just say "Just now"
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