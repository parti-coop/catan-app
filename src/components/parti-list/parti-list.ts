import { Component, Input } from '@angular/core';
import { Parti } from '../../models/parti';
import { NavController } from 'ionic-angular';

import { PartiHomePage } from '../../pages/parti-home/parti-home';

@Component({
  selector: 'parti-list',
  templateUrl: 'parti-list.html'
})
export class PartiList {

  @Input()
  parties: Parti[];
  text: string;

  constructor(
    public navCtrl: NavController
  ) {}

  onClickParti(parti: Parti) {
    this.navCtrl.push(PartiHomePage, { parti: parti });
  }

}
