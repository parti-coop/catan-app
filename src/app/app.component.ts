import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';

import { MyselfData } from '../providers/myself-data';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class PartiApp {
  rootPage;

  constructor(platform: Platform, myselfData: MyselfData) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      myselfData.hasSignedIn().then(
        hasSignedIn => {
          if(hasSignedIn) {
            this.rootPage = TabsPage;
          } else {
            this.rootPage = SignInPage;
          }
        }
      );
    });

  }
}
