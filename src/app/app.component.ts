import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Events } from 'ionic-angular';
import { StatusBar, Network, Deeplinks } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from '../pages/sign-in/sign-in';
import { DisconnectedPage } from '../pages/disconnected/disconnected';

import { MyselfData } from '../providers/myself-data';

@Component({
  templateUrl: 'app.html'
})
export class PartiApp {
  @ViewChild('appNav') navCtrl: NavController;
  rootPage;

  constructor(
    private platform: Platform,
    private events: Events,
    private myselfData: MyselfData
  ) {
    platform.ready().then(() => {
      StatusBar.styleDefault();

      this.defaultRoot((page) => {
        this.rootPage = page;
      });
      this.listenToNetworkStatus();
    });
    this.listenToBaseEvents();
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      Deeplinks.route({
        '/parti/:deepLinkPartiSlug': { page: 'partiHome' }
      }).subscribe(match => {
        setTimeout(() => {
          if('partiHome' == match.$route.page) {
            console.log("Deeplinks : " + JSON.stringify(match.$args));
            this.myselfData.hasSignedIn()
              .then(hasSignedIn => {
                this.events.publish('tabs:parti-deeplink', match.$args);
              }).catch((error) => {
                console.log("PartiApp#ngAfterViewInit : " + error);
                throw error;
              });
          }
        }, 800);
      },
        nomatch => {
          console.log("nomatch: " + nomatch)
        }
      );
    });
  }

  defaultRoot(cb) {
    let current = Network.connection
    if(current == 'none') {
      cb(DisconnectedPage);
      return;
    }
    this.myselfData.hasSignedIn()
      .then(hasSignedIn => {
        cb(hasSignedIn ? TabsPage : SignInPage);
      }).catch((error) => {
        console.log("PartiApp#constructor : " + error);
        throw error;
      });
  }

  listenToNetworkStatus() {
    Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.navCtrl.setRoot(DisconnectedPage);
    });
  }

  listenToBaseEvents() {
    this.events.subscribe('user:signError', () => {
      alert('로그인 하는 중에 뭔가 잘못되었네요. 다시 로그인해 주세요!');
      this.navCtrl.setRoot(SignInPage);
    });
    this.events.subscribe('user:signOut', () => {
      alert('로그아웃 되었습니다. 다시 로그인해 주세요!');
      this.navCtrl.setRoot(SignInPage);
    });
    this.events.subscribe('app:error', (data) => {
      let error = data[0];
      if(error["status"] == 404) {
        alert('찾을 수 없네요.');
      } else {
        alert('오류가 발생했습니다.');
      }
    });
    this.events.subscribe('refresh', () => {
      this.defaultRoot((page) => {
        this.navCtrl.setRoot(page);
      });
    });
  }
}
