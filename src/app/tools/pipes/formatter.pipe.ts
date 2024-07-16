import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatter'
})
export class FormatterPipe implements PipeTransform {

    transform(value: string, prefix : string, suffix : string): string {
        if(!value) return value
        return `${prefix}${value}${suffix}`
    }

}
