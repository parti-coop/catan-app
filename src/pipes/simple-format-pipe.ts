import { Pipe, PipeTransform } from '@angular/core';
import { __platform_browser_private__, DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'simpleFormat'
})
export class SimpleFormatPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  public transform(value: string) {
    return ( value ? this.bypassSanitizer(this.br(value)) : value );
  }

  br(value: string): string {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

  bypassSanitizer(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value)
  }
}
