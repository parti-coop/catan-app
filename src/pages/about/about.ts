import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Settings } from '../../app/settings';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public settings: Settings) {

  }

}
