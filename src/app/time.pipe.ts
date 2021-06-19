import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number, args?: any[]): string {
    let ms = value % 1000;
    value = (value - ms) / 1000;
    let secs = value % 60;
    value = (value - secs) / 60;
    let mins = value % 60;
    let hrs = (value - mins) / 60;

    return (
      this.pad(hrs) +
      ':' +
      this.pad(mins) +
      ':' +
      this.pad(secs) +
      '.' +
      this.pad(ms, 3)
    );
  }
  // Pad to 2 or 3 digits, default is 2
  pad(n, z = 2) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }
}
