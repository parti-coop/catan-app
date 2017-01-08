import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Events, AlertController } from 'ionic-angular';
import { NativeStorage, StatusBar, Network, Deeplinks, InAppBrowser, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { SignInPage } from '../pages/sign-in/sign-in';
import { DisconnectedPage } from '../pages/disconnected/disconnected';

import { MyselfData } from '../providers/myself-data';
import { PushService } from '../providers/push-service';
import { PartiEnvironment } from '../config/constant';

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class PartiApp {
  STORAGE_REFERENCE_SHOWN_INTRO = 'PartiApp_shownIntro';

  @ViewChild('appNav') navCtrl: NavController;
  rootPage;

  constructor(
    private platform: Platform,
    private events: Events,
    private alertCtrl: AlertController,
    private myselfData: MyselfData,
    private partiEnvironment: PartiEnvironment,
    private pushService: PushService
  ) {
    platform.ready().then(() => {
      myselfData.ready().then(() => {
        window.open = (url, target?, opts?) => new InAppBrowser(url, target, opts);

        StatusBar.styleDefault();
        Splashscreen.hide();

        this.initRootPage();
        this.pushService.init();
        this.listenToNetworkStatus();
      });
    });
    this.listenToBaseEvents();
  }

  initRootPage() {
    NativeStorage.getItem(this.STORAGE_REFERENCE_SHOWN_INTRO).then(
      (shown) => {
        if(shown) {
          this.defaultRoot((page) => {
            this.rootPage = page;
          });
        } else {
          this.goToIntro();
        }
      },
      (error) => {
        this.goToIntro();
      }
    );
  }

  goToIntro() {
    NativeStorage.setItem(this.STORAGE_REFERENCE_SHOWN_INTRO, true);
    this.rootPage = IntroPage;
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      Deeplinks.route({
        '/p/:partiSlug': { page: 'indiePartiHome' },
        '/g/:groupSlug/:partiSlug': { page: 'groupPartiHome' }
      }).subscribe(match => {
        setTimeout(() => {
          if('indiePartiHome' == match.$route.page || 'groupPartiHome' == match.$route.page) {
            console.log("Deeplinks : " + JSON.stringify(match.$args));
            this.myselfData.hasSignedIn()
              .then(hasSignedIn => {
                let groupSlug = match.$args.groupSlug;
                this.events.publish('tabs:parti-deeplink', match.$args.partiSlug, groupSlug);
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
    this.events.subscribe('refreshToken:fail', () => {
      this.pushService.unsubscribe();
      let alert = this.alertCtrl.create({
        title: '로그아웃',
        subTitle: '로그아웃 되셨네요. 다시 로그인 해주세요.',
        buttons: ['확인']
      });
      alert.present();
      this.navCtrl.setRoot(SignInPage);
    });
    this.events.subscribe('refresh', () => {
      this.defaultRoot((page) => {
        this.navCtrl.setRoot(page);
      });
    });
  }
}
