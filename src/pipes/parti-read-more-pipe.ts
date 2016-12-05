import { Injectable, Pipe } from '@angular/core';

import _ from 'lodash';

@Pipe({
  name: 'partiReadMore'
})
@Injectable()
export class PartiReadMorePipe {
  static MORE_TOKEN = '<read-more/>';
  static MORE_CLASS_NAME = 'read-more-btn';
  static CHECKBOX_CLASS_NAME = 'read-more-check';

  constructor() {}

  public transform(value: string, truncatedValue: string) {
    if(!truncatedValue) {
      return `<div class="read-more-content"><div class="truncated">${value}</div></div>`;
    }

    let id = this.getId();
    return `<div class="read-more-content">
      <input id="${id}" type="checkbox" class="${PartiReadMorePipe.CHECKBOX_CLASS_NAME}">
      <div class="truncated">${this.setMoreButton(truncatedValue, id)}</div>
      <div class="original">${value}</div>
      </div>`;
  }

  getId(): string {
    return 'parti-read-more-pipe_' + _.uniqueId();
  }

  setMoreButton(value: string, id: string) {
    return value.replace(PartiReadMorePipe.MORE_TOKEN, `<label class="${PartiReadMorePipe.MORE_CLASS_NAME}" for="${id}">더보기</label>`);
  }

  static isMoreButtonEvent(event) {
    let element = event.target || event.srcElement;
    return (element.tagName == 'LABEL' && element.className == PartiReadMorePipe.MORE_CLASS_NAME);
  }

  static extend(event) {
    let element = event.target || event.srcElement;
    let checkId = element.getAttribute("for");
    let check = document.getElementById(checkId);
    if(!!check && check instanceof HTMLInputElement) {
      (check as HTMLInputElement).checked = true;
    }
  }
}
