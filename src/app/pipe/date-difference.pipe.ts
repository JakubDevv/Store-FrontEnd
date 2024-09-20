import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDifference'
})
export class DateDifferencePipe implements PipeTransform {

  transform(dataDate: Date): string {
    let start = new Date().getTime();
    let end = new Date(dataDate).getTime();
    let time = start - end;

    let diffMonth = Math.floor(time / 2629800000);
    let diffDay = Math.floor(time / 86400000);
    let diffHour = Math.floor((time % 86400000) / 3600000);
    let diffMinute = Math.floor(((time % 86400000) % 3600000) / 60000);

    if (diffMonth >= 1) {
      return diffMonth + ' Months ago';
    } else if (diffDay >= 1) {
      return diffDay + ' Days ago';
    } else if (diffHour >= 1) {
      return diffHour + ' Hours ago';
    } else {
      return diffMinute + ' Minutes ago';
    }
  }

}
