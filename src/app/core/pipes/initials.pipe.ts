import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(firstname: string | undefined, lastname: string | undefined): string {
    if (!firstname && !lastname) return '';
    
    const first = firstname ? firstname.charAt(0).toUpperCase() : '';
    const last = lastname ? lastname.charAt(0).toUpperCase() : '';
    
    return `${first}${last}`;
  }
}