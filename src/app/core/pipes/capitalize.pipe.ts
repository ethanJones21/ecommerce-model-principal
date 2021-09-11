import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(txt: string): unknown {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }
}
