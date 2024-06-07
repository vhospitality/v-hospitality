import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'escapeHtml',
  pure: false,
  standalone: true,
})
export class EscapeHtmlPipe implements PipeTransform {
  transform(value: any, args?: any[]) {
    return value;
    // return `<ul> ${_.escape(value)} </ul>`;
  }
}
