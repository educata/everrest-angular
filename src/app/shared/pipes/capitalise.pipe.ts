import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalise',
  standalone: true,
})
export class CapitalisePipe implements PipeTransform {
  transform(value: string) {
    return value
      .split(' ')
      .filter(Boolean)
      .map((text) => `${text[0].toUpperCase()}${text.slice(1)}`)
      .join(' ');
  }
}
