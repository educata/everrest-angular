import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textShorter',
  standalone: true,
})
export class TextShorterPipe implements PipeTransform {
  transform(value: string, words: number = 30) {
    return value.split(' ').slice(0, words).join(' ').concat('...');
  }
}
