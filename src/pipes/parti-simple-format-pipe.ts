import { Injectable, Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'partiSimpleFormat'
})
@Injectable()
export class PartiSimpleFormatPipe {
  constructor(private sanitizer: DomSanitizer) {
  }

  public transform(value: string, type: string) {
    if(!!value && type == 'comment') {
      value = this.br(value)
    }
    return ( value ? this.bypassSanitizer(value) : value );
  }

  br(value: string): string {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

  bypassSanitizer(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value)
  }
}
