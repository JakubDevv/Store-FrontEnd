import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: number | string): string {
    if (typeof value === 'string') {
      value = parseInt(value, 10);
    }

    const phoneNumberString = value.toString();
    return phoneNumberString.slice(0, 3) + '-' + phoneNumberString.slice(3, 6) + '-' + phoneNumberString.slice(6, 9);
  }

}
