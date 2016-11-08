import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook, TwitterConnect } from 'ionic-native';
import { Platform, LoadingController, AlertController } from 'ionic-angular';

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
    private alertCtrl: AlertController,
    private myselfData: MyselfData
  ) {}

  facebookLogin() {
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
        this.navCtrl.setRoot(TabsPage);
        loading.dismiss();
      }).catch((error) => {
        console.log("SignInPage#facebookLogin : " + error);
        loading.dismiss();
        if(error !== "User cancelled.") {
          let alert = this.alertCtrl.create({
            title: '오류',
            subTitle: '아! 뭔가 잘못되었습니다.',
            buttons: ['확인']
          });
          alert.present();
        }
      });
    });
  }

  twitterLogin() {
    let loading = this.loadingCtrl.create({
      content: '잠시만 기다려 주세요...'
    });

    loading.present();
    this.platform.ready().then(() => {
      TwitterConnect.login().then((response) =>{
        return response;
      }).then((snsTokens) => {
        return this.myselfData.auth('twitter', snsTokens.token, snsTokens.secret).toPromise();
      }).then(() => {
        this.navCtrl.setRoot(TabsPage);
        loading.dismiss();
      }).catch((error) => {
        console.log("SignInPage#twitterLogin : " + error);
        loading.dismiss();
        if(error !== "User cancelled authentication.") {
          let alert = this.alertCtrl.create({
            title: '오류',
            subTitle: '아! 뭔가 잘못되었습니다.',
            buttons: ['확인']
          });
          alert.present();
        }
      });
    });
  }

}
