import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours > 12) {
      // Show day, hours, and minutes if more than 12 hours have passed
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short', hour: 'numeric', minute: 'numeric'
      }).format(date);
    } else {
      // Show only hours and minutes
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric', minute: 'numeric'
      }).format(date);
    }
  }
}
