import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Events } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';

import { MyselfData } from '../providers/myself-data';

@Component({
  template: `<ion-nav #appNav [root]="rootPage"></ion-nav>`
})
export class PartiApp {
  @ViewChild('appNav') navCtrl: NavController;
  rootPage;

  constructor(
    platform: Platform,
    myselfData: MyselfData,
    private events: Events
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      myselfData.hasSignedIn()
        .then(hasSignedIn => {
          this.rootPage = hasSignedIn ? TabsPage : SignInPage;
        }).catch((error) => {
          console.log("PartiApp#constructor : " + error);
          throw error;
        });
    });
    this.listenToLoginEvents();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:signerror', () => {
      alert('로그인 하는 중에 뭔가 잘못되었네요. 다시 로그인해 주세요!');
      this.navCtrl.setRoot(SignInPage);
    });
    this.events.subscribe('user:signout', () => {
      alert('로그아웃 되었습니다. 다시 로그인해 주세요!');
      this.navCtrl.setRoot(SignInPage);
    });
  }
}
