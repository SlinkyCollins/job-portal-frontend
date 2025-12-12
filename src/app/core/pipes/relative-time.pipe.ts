import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    try {
      // 1. Standardize SQL timestamp to ISO format (replace space with T)
      // Input: "2025-12-11 20:43:59" -> Output: "2025-12-11T20:43:59"
      let isoString = value.replace(' ', 'T');

      // 2. Handle Environment Differences
      if (environment.production) {
        // PRODUCTION (Render): Server sends UTC.
        // We MUST append 'Z' so date-fns knows this is UTC.
        if (!isoString.endsWith('Z')) {
          isoString += 'Z';
        }
      } 
      // LOCAL (XAMPP): Server sends Local Time.
      // We leave it without 'Z'. parseISO treats strings without 'Z' as Local Time.

      // 3. Parse and Format
      const date = parseISO(isoString);
      
      // 4. Calculate distance
      // addSuffix: true adds "ago" or "in" automatically
      return formatDistanceToNow(date, { addSuffix: true });

    } catch (error) {
      console.error('Date parsing error:', error);
      return value; // Fallback to original string if it fails
    }
  }
}