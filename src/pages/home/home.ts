import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Settings } from '../../app/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public settings: Settings) {

  }

}
