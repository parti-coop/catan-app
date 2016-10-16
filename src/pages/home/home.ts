import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PartiEnvironment } from '../../config/constant';
import { Facebook } from 'ionic-native';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private platform: Platform;

  constructor(platform: Platform, public navCtrl: NavController, public partiEnvironment: PartiEnvironment) {
    this.platform = platform;
  }

  login() {
    this.platform.ready().then(() => {
      Facebook.login(["email"]).then(
        (result) => {
          Facebook.getAccessToken().then(
            (token) => {
              console.log("Token: " + token);
            }
           );
        },
        (error) => { console.log(error); }
       );
    })
  }

  getdetails() {
    console.log("getdetails");
    alert('getdetails');
  }

  logout() {
    console.log("logout");
    alert("logout");
  }
}
