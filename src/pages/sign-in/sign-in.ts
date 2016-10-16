import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from 'ionic-native';
import { Platform, LoadingController } from 'ionic-angular';

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

  ionViewDidLoad() {
    console.log('Hello SignIn Page');
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.platform.ready().then(() => {
      Facebook.login(["email"])
      .then((result) => {
        return Facebook.getAccessToken()
      }).then((snsAccessToken) => {
        return this.myselfData.auth('facebook', snsAccessToken);
      }).then(() => {
        this.navCtrl.push(TabsPage);
        loading.dismiss();
      }).catch((error) => {
        console.log(error);
        loading.dismiss();
        alert('엇, 뭔가 잘못되었네요.');
      });
    });
  }

}
