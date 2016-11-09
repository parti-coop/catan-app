import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { PartiEnvironment } from '../../config/constant';

@Component({
  selector: 'page-disconnected',
  templateUrl: 'disconnected.html'
})
export class DisconnectedPage {
  constructor(
    public navCtrl: NavController,
    private events: Events,
    public partiEnvironment: PartiEnvironment
  ) {}

  onClickRetry() {
    this.events.publish('refresh');
  }
}
