import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDesc',
})
export class TimeDescPipe implements PipeTransform {
  transform(value: number): string {
    let now = Date.now();
    let timePass = now - value;
    if (timePass < 1000 * 5) return '5 seconds ago';
    else if (timePass < 1000 * 60 * 7) return '7 minuets ago';
    else if (timePass < 1000 * 60 * 60 * 3) return '3 hours ago';
    else {
      let date = new Date(value);
      return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  }
}
