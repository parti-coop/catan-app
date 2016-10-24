import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from 'ionic-native';
import { Platform, LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/toPromise';

import { TabsPage } from '../../pages/tabs/tabs';

import { PartiEnvironment } from '../../config/constant';
import { MyselfData } from '../../providers/myself-data';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html'
})
export class SignInPage {
  constructor(
    public navCtrl: NavController,
    public partiEnvironment: PartiEnvironment,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    private myselfData: MyselfData,
  ) {}

  login() {
    let loading = this.loadingCtrl.create({
      content: '잠시만 기다려 주세요...'
    });

    loading.present();
    this.platform.ready().then(() => {
      Facebook.login(["email"])
      .then((result) => {
        return Facebook.getAccessToken()
      }).then((snsAccessToken) => {
        return this.myselfData.auth('facebook', snsAccessToken).toPromise();
      }).then(() => {
        this.navCtrl.push(TabsPage);
        loading.dismiss();
      }).catch((error) => {
        console.log("SignInPage#login : " + error);
        loading.dismiss();
        if(error !== "User cancelled.") {
          alert('엇, 뭔가 잘못되었네요.');
        }
      });
    });
  }

}
