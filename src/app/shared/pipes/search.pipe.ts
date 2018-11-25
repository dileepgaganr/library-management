import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (!args.val || !args.key) {
      return value;
    }
    return Object.values(value).filter(val => {
      return val[args.key].toLowerCase().match(args.val.toLowerCase())
    });
  }

}
