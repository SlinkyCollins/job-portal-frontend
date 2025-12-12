import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, parseISO } from 'date-fns';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    try {
      // 1. Standardize SQL timestamp to ISO format
      let isoString = value.replace(' ', 'T');

      // 2. RELIABLE Environment Detection
      // We check the browser URL directly. 
      // If it's NOT localhost, we assume it's Production (Render).
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (!isLocal) {
        // --- PRODUCTION (Render) ---
        // Server sends UTC. We MUST append 'Z'.
        if (!isoString.endsWith('Z')) {
          isoString += 'Z';
        }
      } 
      // --- LOCAL (XAMPP) ---
      // Server sends Local Time. We leave it alone.

      // 3. Parse and Format
      const date = parseISO(isoString);
      return formatDistanceToNow(date, { addSuffix: true });

    } catch (error) {
      console.error('Date parsing error:', error);
      return value;
    }
  }
}