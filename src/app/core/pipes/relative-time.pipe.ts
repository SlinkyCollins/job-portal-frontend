import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Handle future dates
    if (diffMs < 0) return 'Just now';

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    const diffMonths = Math.floor(diffDays / 30); // Approximate months

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;

    // Fallback for older dates (months or more)
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;

    // For very old dates, show years
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }

}
