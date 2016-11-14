import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  constructor(
    public navCtrl: NavController,
    private events: Events
  ) {}

  goToHome() {
    this.events.publish('refresh');
  }

  mySlideOptions = {
    pager: true
  };
}
