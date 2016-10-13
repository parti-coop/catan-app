import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Settings } from '../../app/settings';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public settings: Settings) {

  }

}
