import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'asMoney'})
export class MoneyPipe implements PipeTransform {

  transform(value: number | null, currency: string = 'EUR'): string {
    const currencySymbol = currency === 'EUR' ? '€' : currency;
    if (typeof value === 'number') {
      return `${value.toFixed(2)}\u00a0${currencySymbol}`;
    } else {
      return '';
    }
  }

}
