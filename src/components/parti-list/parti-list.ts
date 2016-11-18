import { Component, Input } from '@angular/core';
import { Parti } from '../../models/parti';

@Component({
  selector: 'parti-list',
  templateUrl: 'parti-list.html'
})
export class PartiList {

  @Input()
  parties: Parti[];
  text: string;

  constructor() {
    console.log('Hello PartiList Component');
    this.text = 'Hello World';
  }

}
