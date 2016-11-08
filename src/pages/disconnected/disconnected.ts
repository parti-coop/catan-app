import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PartiEnvironment } from '../../config/constant';

@Component({
  selector: 'page-disconnected',
  templateUrl: 'disconnected.html'
})
export class DisconnectedPage {
  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment
  ) {}
}
